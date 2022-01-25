import singletons from '@/modules/singletons';
import { SCHEMAS } from '@/modules/singletons/json-schemas';
import { ApiError } from '@/modules/utils';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { NextApiRequest, NextApiResponse } from 'next';
import NextCors from 'nextjs-cors';
import amqplib from 'amqplib'
import { signingQueue, RETRY_AFTER } from '@/modules/metadata-signing';



export default async function handler(req: NextApiRequest, res: NextApiResponse<object>) {
  await NextCors(req, res, {
    methods: ['POST', 'HEAD', 'OPTIONS'],
    origin: '*',
  });

  try {
    switch (req.method) {
      case 'POST': {
        const schemas = singletons.jsonSchemas;
        const validateParams = schemas.validator(SCHEMAS.signMetaParams);

        const params = req.body;

        if (!validateParams(params)) {
          throw new ApiError(
            400,
            `Invalid request parameters: ${validateParams.errors?.map((e) => e.message).join(', ')}`
          );
        }

        const connection = await amqplib.connect(process.env.CLOUDAMQP_URL || '');
        const channel = await connection.createChannel()
        await channel.assertQueue(signingQueue,
          {
            durable: true,
            autoDelete: false,
            deadLetterExchange: 'delayedDeadLetterExchange',
            deadLetterRoutingKey: 'dle-key',
        })
        try {
          channel.sendToQueue(
            signingQueue,
            Buffer.from(JSON.stringify(params)),
            {
              headers: {
                'x-delay': RETRY_AFTER
              }
            }
          )
        } catch(error) {
          console.error({ error }, 'error enqueing signing job')
          throw new ApiError(500, 'Error signing please try again later \n' + error)
        }

        await channel.close()
        await connection.close()

        return res.status(200).end();
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
