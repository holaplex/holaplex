import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seed() {
  const demo = await prisma.storefront.upsert({
    where: { subdomain: "localhost" },
    update: {},
    create: {
      subdomain: "localhost",
      pubkey: "2UnsjcXyXTJGLGcUwBYSTxJVwC9KYfaNbmd4wKk4zCoP",
      theme: {},
      themeUrl: ''
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
