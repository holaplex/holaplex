import pinataSDK from '@pinata/sdk'

export const pinata = pinataSDK(
  process.env.NEXT_PINATA_API_KEY || '',
  process.env.NEXT_PINATA_SECRET_KEY || ''
)