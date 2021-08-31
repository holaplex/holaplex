import { formatFingerprint } from '@/common/constants/signature-message';
import { WalletContext } from '@/modules/wallet';
import { Buffer } from 'buffer';
import { useCallback, useContext } from 'react';
import nacl from 'tweetnacl';

const Tmp = () => {
  const { solana } = useContext(WalletContext);

  const submit = useCallback(async () => {
    try {
      if (!solana) throw new Error('Could not connect to Solana!');

      if (!solana.isConnected) {
        await Promise.all([
          new Promise<void>((ok) => solana.once('connect', ok)),
          solana.connect(),
        ]);
      }

      // TODO
      const depositTransaction =
        '3pqb74BgdDE8LWCDfu85tbgTASph4ZNUdC2JjVgKL83i1ViPBsQfbjDKsssJ5ado5MyxZkzeovurdNN94uHpdLC';

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

      const res = await fetch('/api/upload-store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notarized),
      });
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
