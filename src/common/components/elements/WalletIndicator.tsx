import { showFirstAndLastFour } from '@/modules/utils/string';
import { useWallet } from '@solana/wallet-adapter-react';
import cx from 'classnames';
import { toast } from 'react-toastify';
import { Check } from '../icons/Check';

export const WalletLabel = () => {
  const { publicKey, connecting, disconnecting, connected } = useWallet();
  const handleLabelClick = async () => {
    if (publicKey?.toBase58().length) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      toast(
        <div className="flex items-center justify-between">
          <div className="flex items-center text-white">
            <Check color="#32D583" className="mr-2" />
            <div>Wallet address copied to clipboard.</div>
          </div>
        </div>
      );
    }
  };
  return (
    <button onClick={handleLabelClick} className="inline-flex h-6 items-center">
      <div
        className={cx(
          "h-2 w-2 rounded-full content-['']",
          { 'bg-[#00d072]': connected },
          { 'bg-[#d04200]': !connected },
          { 'bg-[#d0b100]': connecting || disconnecting }
        )}
      />
      <span className="inline-flex items-center font-['Space_Mono'] text-[12px] leading-[16px] tracking-[0.02em] text-gray-300">
        &nbsp;{publicKey ? showFirstAndLastFour(publicKey.toBase58()) : 'DISCONNECTED'}&nbsp;
        {/* <Copy className="h-2 w-2" /> */}
      </span>
    </button>
  );
};
