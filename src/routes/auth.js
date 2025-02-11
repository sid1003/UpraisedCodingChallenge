const jwt = require("jsonwebtoken");
const express = require("express");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const prisma = new PrismaClient();
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    let msg = "Invalid credentials";
    console.log(msg);
    return res.status(401).json(new ApiResponse(401, null, msg, false));
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  res.status(200).json(new ApiResponse(200, token, "Login successfull", true));
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    let msg = "Username and password are required";
    console.log(msg);
    return res.status(400).json(new ApiResponse(400, null, msg, false));
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { id: user.id, username: user.username },
          "Registration successfull",
          true
        )
      );
  } catch (error) {
    if (error.code === "P2002") {
      let msg = "Username already exists";
      console.log(msg);
      return res.status(400).json(new ApiResponse(400, null, msg, false));
    }

    let msg = "Internal server error";
    console.log(msg);
    res.status(400).json(new ApiResponse(400, null, msg, false));
  }
});

module.exports = router;
