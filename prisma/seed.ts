import prisma from  '@/modules/db'
import { style } from '@/modules/storefront'

async function seed() {
  const storefront = {
    subdomain: "localhost",
    pubkey: "2UnsjcXyXTJGLGcUwBYSTxJVwC9KYfaNbmd4wKk4zCoP",
    theme: {
      backgroundColor: '#eeeeee',
      primaryColor: '#4caf50'

    }
  }

  const themeUrl = await style(
    storefront,
    storefront.theme
  )

  const themedStorefront = { ...storefront, themeUrl }

  await prisma.storefront.upsert({
    where: { subdomain: storefront.subdomain },
    update: themedStorefront,
    create: themedStorefront 
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
