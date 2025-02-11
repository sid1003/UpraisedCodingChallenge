const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const generateUniqueCodename = require("../utils/codenameGenerator");
const { log } = require("console");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const prisma = new PrismaClient();

router.get("/", async (req, res) => {
  const { status } = req.query;
  const validStatuses = [
    "Available",
    "Deployed",
    "Destroyed",
    "Decommissioned",
  ];

  if (status && !validStatuses.includes(status)) {
    let msg = "Invalid status";
    console.log(msg);
    return res.status(400).json(new ApiResponse(400, null, msg, false));
  }

  try {
    const gadgets = await prisma.gadget.findMany({
      where: status ? { status } : {},
    });
    const gadgetsWithProbability = gadgets.map((gadget) => ({
      ...gadget,
      missionSuccessProbability: Math.floor(Math.random() * 100) + 1,
    }));

    res
      .status(200)
      .json(new ApiResponse(200, gadgetsWithProbability, "All gadgets", true));
  } catch (error) {
    let msg = "Error while uploadingCSV: " + error.message;
    console.log(msg);
    res.status(500).json(new ApiResponse(500, null, msg, false));
  }
});

router.post("/", async (req, res) => {
  const { name } = req.body;

  try {
    const name = await generateUniqueCodename();
    const newGadget = await prisma.gadget.create({
      data: { name },
    });
    res
      .status(201)
      .json(new ApiResponse(201, newGadget, "Added new gadget", true));
  } catch (error) {
    let msg = "Error while creating gadget: " + error.message;
    console.log(msg);
    res.status(500).json(new ApiResponse(500, null, msg, false));
  }
});


router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, status } = req.body;

  try {
    const updatedGadget = await prisma.gadget.update({
      where: { id },
      data: { name, status },
    });
    res
      .status(200)
      .json(new ApiResponse(200, updatedGadget, "Updated gadget", true));
  } catch (error) {
    if (error.code === "P2025") {
      let msg = "Gadget not found: " + error.message;
      console.log(msg);
      return res.status(404).json(new ApiResponse(500, null, msg, false));
    }
    let msg = "Error while updating Gadget: " + error.message;
    console.log(msg);
    res.status(500).json(new ApiResponse(500, null, msg, false));
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const decommissionedGadget = await prisma.gadget.update({
      where: { id },
      data: {
        status: "Decommissioned",
        decommissionedAt: new Date(),
      },
    });
    res
      .status(200)
      .json(new ApiResponse(200, decommissionedGadget, "Deleted gadget", true));
  } catch (error) {
    if (error.code === "P2025") {
      let msg = "Gadget not found: " + error.message;
      console.log(msg);
      return res.status(404).json(new ApiResponse(500, null, msg, false));
    }
    let msg = "Error while deleting gadget: " + error.message;
    console.log(msg);
    res.status(500).json(new ApiResponse(500, null, msg, false));
  }
});


router.post("/:id/self-destruct", async (req, res) => {
  const { id } = req.params;

  try {
    const confirmationCode = Math.floor(100000 + Math.random() * 900000);
    await prisma.gadget.update({
      where: { id },
      data: { status: "Destroyed" },
    });
    res
      .status(200)
      .json(new ApiResponse(201, { confirmationCode: confirmationCode.toString() }, "Self destruct started", true));
  } catch (error) {
    if (error.code === "P2025") {
    let msg = "Gadget not found: " + error.message;
      console.log(msg);
      return res.status(404).json(new ApiResponse(500, null, msg, false));
    }
    let msg = "Error while self destructing gadget: " + error.message;
    console.log(msg);
    res.status(500).json(new ApiResponse(500, null, msg, false));
  }
});

module.exports = router;
