// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/modules/db';
import { Prisma } from '@prisma/client';
import { Wallet } from '@/modules/wallet/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse<Wallet | object>) {
  switch (req.method) {
    case 'POST': {
      try {
        const pubkey = req.body.pubkey as string;
        const data = {
          pubkey,
        } as Wallet;

        const wallet = await prisma.wallets.create({
          data,
        });
        return res.status(201).json(wallet);
      } catch (error: any) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return res.status(422).end(error.message);
        } else {
          return res.status(500).end(error.message);
        }
      }
    }
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
