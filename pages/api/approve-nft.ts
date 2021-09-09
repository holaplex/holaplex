import { cors } from '@/modules/middleware';
import { ApproveNFTParams } from '@/modules/storefront/approve-nft';
import { ApiError } from '@/modules/utils';
import { WALLETS } from '@/modules/wallet/server';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import Ajv, { JTDSchemaType } from 'ajv/dist/jtd';
import { Buffer } from 'buffer';
import { NextApiRequest, NextApiResponse } from 'next';

/** Adapted from metaplex/js/packages/common/src/actions/metadata.ts */
export function signMetadata(
  metadata: PublicKey,
  creator: PublicKey,
  tx: Transaction,
  programId: PublicKey
) {
  const data = Buffer.from([7]);

  const keys = [
    {
      pubkey: metadata,
      isSigner: false,
      isWritable: true,
    },
    {
      pubkey: creator,
      isSigner: true,
      isWritable: false,
    },
  ];

  tx.add(new TransactionInstruction({ keys, programId, data }));
}

/** JSON schemas for parsing request parameters. */
const SCHEMAS = (() => {
  const ajv = new Ajv();

  const params: JTDSchemaType<ApproveNFTParams> = {
    properties: {
      solanaEndpoint: { type: 'string' },
      metadata: { type: 'string' },
      metaProgramId: { type: 'string' },
    },
    additionalProperties: true,
  };

  return { validateParams: ajv.compile(params) };
})();

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  try {
    await cors(req, res);

    switch (req.method) {
      case 'POST': {
        const { solana, solanaKeypair, solanaEndpoint } = await WALLETS;
        const { validateParams } = SCHEMAS;

        const params = req.body;

        if (!validateParams(params)) {
          throw new ApiError(
            400,
            `Invalid request parameters: ${validateParams.errors?.map((e) => e.message).join(', ')}`
          );
        }

        const {
          solanaEndpoint: clientSolEndpoint,
          metadata: metadataStr,
          metaProgramId: metaProgramIdStr,
        } = params;

        if (!metaProgramIdStr.startsWith('meta')) {
          throw new ApiError(400, 'Invalid program ID');
        }

        if (clientSolEndpoint !== solanaEndpoint) {
          throw new ApiError(400, 'Mismatched Solana endpoint');
        }

        let metadata;
        let metaProgramId;

        try {
          metadata = new PublicKey(metadataStr);
          metaProgramId = new PublicKey(metaProgramIdStr);
        } catch {
          throw new ApiError(400, 'Invalid public keys');
        }

        const tx = new Transaction();

        signMetadata(metadata, solanaKeypair.publicKey, tx, metaProgramId);

        tx.feePayer = solanaKeypair.publicKey;
        tx.recentBlockhash = (await solana.getRecentBlockhash()).blockhash;

        const signature = await solana.sendTransaction(tx, [solanaKeypair]);
        const status = (await solana.confirmTransaction(signature)).value;
        const err = status.err;

        if (err !== null) {
          throw new ApiError(500, 'Approval transaction failed');
        }

        return res.status(204).end();
      }
      case 'OPTIONS': return res.status(204).end();
      default:
        res.setHeader('Allow', ['POST', 'OPTIONS']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (e) {
    if (e instanceof ApiError) {
      return res.status(e.status).json(e.json);
    } else {
      console.error(e);

      return res.status(500).end();
    }
  }
}
