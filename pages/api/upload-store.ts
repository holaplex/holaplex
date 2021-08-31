import { formatFingerprint } from '@/common/constants/signature-message';
import { Storefront } from '@/modules/storefront/types';
import { Connection, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { NextApiRequest, NextApiResponse } from 'next';
import nacl from 'tweetnacl';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Storefront[] | object>
) {
  switch (req.method) {
    case 'POST': {
      try {
        const badRequest = () => res.status(400).end('Bad Request');
        const params = req.body;

        if (!(typeof params === 'object' && params)) return badRequest();

        const { payload, signature } = params;

        if (!(typeof payload === 'string' && typeof signature === 'string')) return badRequest();

        let payloadBuf: Buffer;
        let signatureBuf: Buffer;
        let payloadDec: any;

        try {
          payloadBuf = Buffer.from(payload, 'base64');
          signatureBuf = Buffer.from(signature, 'base64');
          payloadDec = JSON.parse(payloadBuf.toString('utf-8'));
        } catch {
          return badRequest();
        }

        if (!(typeof payloadDec === 'object' && payloadDec)) return badRequest();

        const { depositTransaction } = payloadDec;

        if (typeof depositTransaction !== 'string') return badRequest();

        // TODO
        const conn = new Connection('https://api.devnet.solana.com');
        let tx;

        try {
          tx = await conn.getTransaction(depositTransaction);
        } catch {
          return badRequest();
        }

        if (tx === null) return badRequest();

        const pubkeys = tx.transaction.message.accountKeys.map((k) => new PublicKey(k));

        const msg = await formatFingerprint(payloadBuf);
        const sender = pubkeys.find((k) =>
          nacl.sign.detached.verify(msg, signatureBuf, k.toBytes())
        );

        if (sender === undefined) return res.status(403).end('Bad Keypair');

        // TODO: arweave stuff

        return res.status(204).end();
      } catch (e) {
        console.error(e);
        return res.status(500).end();
      }
    }
    default:
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
