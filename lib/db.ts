// Option 1
import { PrismaClient } from "./generated/prisma"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

const db = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db

export default db

/*
// Option 2
import { PrismaClient } from "./generated/prisma"
import { PrismaNeon } from "@prisma/adapter-neon"

const connectionString = `${process.env.DATABASE_URL}`
const adapter = new PrismaNeon({ connectionString })
const db = new PrismaClient({ adapter })

export default db
*/
