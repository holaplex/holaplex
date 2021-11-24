import type { NextApiRequest, NextApiResponse } from 'next';
import { contains } from 'ramda';
import { initArweave } from '@/modules/arweave';
import NextCors from 'nextjs-cors';

export default async function handler(req: NextApiRequest, res: NextApiResponse<string>) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD'],
    origin: '*',
  });

  try {
    const arweave = initArweave();
    const id = req.query.id as string;
    const dataParams = {
      decode: true,
    } as { decode: boolean; string: boolean };

    try {
      const transaction = await arweave.transactions.get(id);

      // @ts-ignore
      transaction.get('tags').forEach((transaction) => {
        const name = transaction.get('name', { decode: true, string: true });
        if (contains(name, ['Content-Type'])) {
          res.setHeader(name, transaction.get('value', { decode: true, string: true }));
        }
      });
    } catch (_) {}

    if (
      contains(res.getHeader('Content-Type'), [
        'text/html',
        'text/plain',
        'text/xml',
        'application/json',
        'application/xml',
      ])
    ) {
      dataParams['string'] = true;
    }

    const data = await arweave.transactions.getData(id, dataParams);

    res.setHeader('Cache-Control', 'max-age=31536000');

    switch (req.method) {
      case 'GET': {
        return res.status(200).end(data);
      }
      default:
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (_) {
    res.status(500).end();
  }
}
