
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


function serializeBigInt(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  ));
}

module.exports = {
  prisma,
  serializeBigInt
};