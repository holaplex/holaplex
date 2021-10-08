import singletons from '@/modules/singletons';
import { SCHEMAS } from '@/modules/singletons/json-schemas';
import { ApiError } from '@/modules/utils';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';

/** Adapted from metaplex/js/packages/common/src/actions/metadata.ts */
function signMetadata(
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  await NextCors(req, res, {
    methods: ['POST', 'HEAD', 'OPTIONS'],
    origin: '*',
  });

  try {
    switch (req.method) {
      case 'POST': {
        const { connection, keypair, endpoint } = await singletons.solana;
        const schemas = singletons.jsonSchemas;
        const validateParams = schemas.validator(SCHEMAS.signMetaParams);

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

        if (clientSolEndpoint !== endpoint) {
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

        signMetadata(metadata, keypair.publicKey, tx, metaProgramId);

        tx.feePayer = keypair.publicKey;
        tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

        const signature = await connection.sendTransaction(tx, [keypair]);
        const status = (await connection.confirmTransaction(signature)).value;
        const err = status.err;

        if (err !== null) {
          throw new ApiError(500, 'Approval transaction failed');
        }

        return res.status(204).end();
      }
      case 'HEAD':
      case 'OPTIONS':
        return res.status(204).end();
      default:
        res.setHeader('Allow', ['POST', 'HEAD', 'OPTIONS']);
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
