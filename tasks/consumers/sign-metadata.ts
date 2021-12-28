import amqplib from 'amqplib'
import singletons from '../../src/modules/singletons';
import { SCHEMAS } from '../../src/modules/singletons/json-schemas';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { signingQueue } from '../../src/modules/metadata-signing'

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


async function consume() {

  const connection = await amqplib.connect(process.env.CLOUDAMQP_URL || '');
  const channel = await connection.createChannel()
  const dle = await channel.assertExchange("DeadLetterExchange", "topic" , {
    durable: true,
    autoDelete: false,
  })
  const primaryExchange = await channel.assertExchange("primaryExchange", "fanout" , {
    durable: true,
    autoDelete: false,
  })
  await channel.assertQueue("deadLetterQueue",
    {
      durable: true,
      autoDelete: false,
    })
  await channel.assertQueue(signingQueue,
    {
      durable: true,
      autoDelete: false,
      deadLetterExchange: 'DeadLetterExchange',
      deadLetterRoutingKey: 'dle-key'
    })
  
  channel.bindQueue(
    "deadLetterQueue",
    dle.exchange,
    "dle-key",
  );

  
  channel.bindQueue(signingQueue, primaryExchange.exchange, "dle-key");
  channel.consume(signingQueue, async function(msg) {
    if (msg !== null) {
      let parsedMessage; 

      
      try {
        parsedMessage = JSON.parse(msg.content.toString())
      } catch(err) {
        console.error(err, msg.toString(), 'could not parse message as json')
        channel.reject(msg, false)
        return;
      }


      const { connection, keypair, endpoint } = await singletons.solana;
      const schemas = singletons.jsonSchemas;
      const validateMessage = schemas.validator(SCHEMAS.signMetaParams);
      if (!validateMessage(parsedMessage)) {
        channel.reject(msg, false)
        console.error(
          `Invalid message body: ${validateMessage.errors?.map((e) => e.message).join(', ')}`
        );
        return;
      }
      
      const {
        solanaEndpoint: clientSolEndpoint,
        metadata: metadataStr,
        metaProgramId: metaProgramIdStr,
      } = parsedMessage;

      if (!metaProgramIdStr.startsWith('meta')) {
        console.error('Invalid program ID');
        channel.reject(msg, false)
        return;
      }

      if (clientSolEndpoint !== endpoint) {
        console.error('Mismatched Solana endpoint');
        channel.reject(msg, false)
        return;
      }

      let metadata;
      let metaProgramId;

      try {
        metadata = new PublicKey(metadataStr);
        metaProgramId = new PublicKey(metaProgramIdStr);
      } catch {
        console.error('Invalid public keys');
        channel.reject(msg, false)
        return;
      }

      try {
        const tx = new Transaction();

        signMetadata(metadata, keypair.publicKey, tx, metaProgramId);

        tx.feePayer = keypair.publicKey;
        tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

        const signature = await connection.sendTransaction(tx, [keypair]);
        const status = (await connection.confirmTransaction(signature)).value;
        const err = status.err;

        if (err !== null) {
          msg.properties.headers['x-first-death-reason'] = err.toString()
          channel.reject(msg, false)
          console.error('Approval transaction failed', err);
          return;
        }

      } catch(err) {
        console.error(err)
        channel.reject(msg, false)
        return;
      }


      channel.ack(msg);
    }
  })
}
consume()