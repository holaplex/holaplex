import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/modules/db';
import { Wallet } from '@/modules/wallet/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Wallet>) {
  const wallet = (await prisma.wallets.findUnique({
    where: {
      pubkey: req.query.pubkey as string,
    },
  })) as Wallet;

  if (!wallet) {
    return res.status(404).end();
  }

  switch (req.method) {
    case 'GET': {
      return res.status(200).json(wallet);
    }
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
