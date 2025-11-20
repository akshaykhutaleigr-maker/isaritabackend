require('dotenv').config();  // Load .env variables

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = prisma;