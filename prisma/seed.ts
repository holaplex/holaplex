import { PrismaClient } from '@prisma/client'
import { Storefront } from './../lib/types'
import { style } from './../lib/services/storefront'

const prisma = new PrismaClient()

async function seed() {

  const storefront = {
    subdomain: "localhost",
    pubkey: "2UnsjcXyXTJGLGcUwBYSTxJVwC9KYfaNbmd4wKk4zCoP",
    theme: {
      backgroundColor: '#eeeeee',
      primaryColor: '#4caf50'

    }
  } as Storefront

  const themeUrl = await style(
    storefront,
    storefront.theme
  )

  await prisma.storefront.upsert({
    where: { subdomain: storefront.subdomain },
    update: {},
    create: { ...storefront, themeUrl } as Storefront 
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
