import { formatFingerprint } from '@/common/constants/signature-message';
import { Storefront } from '@/modules/storefront/types';
import { PAYLOAD_FORM_NAME, SIGNATURE_FORM_NAME, UploadPayload } from '@/modules/storefront/upload';
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
      const payload: UploadPayload = {
        depositTransaction,
        storefront: {} as Storefront<string>, // TODO
        css: '', // TODO
        nonce: nonceBytes.toString('base64'),
      };
      const payloadBuf = Buffer.from(JSON.stringify(payload), 'utf-8');
      const { publicKey, signature } = await solana.signMessage(
        await formatFingerprint(payloadBuf),
        'utf-8'
      );

      const body = new FormData();

      body.append(PAYLOAD_FORM_NAME, new Blob([payloadBuf], { type: 'application/json' }));
      body.append(SIGNATURE_FORM_NAME, signature.toString('base64'));
      // body.append('logo', ...);
      // body.append('favicon', ...);

      const postResp = await fetch('/api/upload-store', { method: 'POST', body });

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
