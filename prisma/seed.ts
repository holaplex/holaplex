import prisma from  '@/modules/db'
import { Wallet } from '@/modules/wallet/types'

const PUBKEY = process.env.SOLANA_PUBKEY

async function seed() {
  const wallet = { pubkey: PUBKEY, approved: true } as Wallet

  await prisma.wallets.upsert({
    where: { pubkey: wallet.pubkey },
    update: wallet,
    create: wallet
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
