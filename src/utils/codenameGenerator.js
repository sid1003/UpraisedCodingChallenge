const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { faker } = require("@faker-js/faker");
const ApiError = require("../utils/ApiError");

async function generateUniqueCodename() {
  try {
    let name;
    let isUnique = false;

    while (!isUnique) {
      name = `The ${faker.word.adjective()} ${faker.word.noun()}`;

      const existing = await prisma.gadget.findUnique({ where: { name } });
      if (!existing) isUnique = true;
    }

    return name;
  } catch (error) {
    let msg = "Error generating codename for mission: \n" + e.message;
    console.log(msg);
    throw new ApiError(500, msg);
  }
}

module.exports = generateUniqueCodename;
