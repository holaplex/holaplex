import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  const demo = await prisma.storefront.upsert({
    where: { subdomain: "espi" },
    update: {},
    create: {
      subdomain: "espi",
      pubkey: "2UnsjcXyXTJGLGcUwBYSTxJVwC9KYfaNbmd4wKk4zCoP",
      theme: {},
    }
  })
}

seed()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
