import { formatFingerprint } from '@/common/constants/signature-message';
import { WalletContext } from '@/modules/wallet';
import {
  Connection,
  PublicKey,
  sendAndConfirmRawTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useCallback, useContext } from 'react';
import nacl from 'tweetnacl';

const Tmp = () => {
  const { solana } = useContext(WalletContext);

  const submit = useCallback(async () => {
    try {
      if (!solana) throw new Error('Could not connect to Solana');

      if (!solana.isConnected) {
        await Promise.all([
          new Promise<void>((ok) => solana.once('connect', ok)),
          solana.connect(),
        ]);
      }

      const infoResp = await fetch('/api/upload-store', { method: 'GET' });

      if (!infoResp.ok) throw new Error('Could not get upload information');

      const info = await infoResp.json();

      if (!(typeof info === 'object' && info))
        throw new Error('Invalid upload information received');

      const { uploadFee, depositKey: depositKeyStr, solanaEndpoint } = info;

      if (
        !(
          typeof uploadFee === 'number' &&
          typeof depositKeyStr === 'string' &&
          typeof solanaEndpoint === 'string'
        )
      )
        throw new Error('Invalid upload information received');

      const depositKey = new PublicKey(depositKeyStr);
      const connection = new Connection(solanaEndpoint);
      const payer = new PublicKey(solana.publicKey);

      const tx = new Transaction();

      tx.add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: depositKey,
          lamports: uploadFee,
        })
      );

      tx.feePayer = payer;
      tx.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;

      const signed = await solana.signTransaction(tx);
      const depositTransaction = await sendAndConfirmRawTransaction(connection, tx.serialize());

      const nonceBytes = Buffer.from(nacl.randomBytes(4));
      const payload = Buffer.from(
        JSON.stringify({
          depositTransaction,
          nonce: nonceBytes.toString('base64'),
        }),
        'utf-8'
      );
      const { publicKey, signature } = await solana.signMessage(
        await formatFingerprint(payload),
        'utf-8'
      );

      const notarized = {
        payload: payload.toString('base64'),
        signature: signature.toString('base64'),
      };

      const postResp = await fetch('/api/upload-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notarized),
      });

      if (!postResp.ok) {
        const json = await postResp.json();
        throw new Error(`Store upload failed: ${json.message ?? JSON.stringify(json)}`);
      }
    } catch (e) {
      console.error(e);

      // TODO
    }
  }, [solana]);

  return (
    <>
      <button onClick={submit}>hi</button>
    </>
  );
};

export default Tmp;
