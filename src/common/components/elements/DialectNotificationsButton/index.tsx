import {
  defaultVariables,
  IncomingThemeVariables,
  NotificationsButton,
} from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import Bell from './BellIcon';
import Settings from './SettingsIcon';
import Close from './CloseIcon';

const HOLAPLEX_MONITORING_PUBLIC_KEY = new PublicKey(
  'BpVYWaAPbv5vyeRxiX9PMsmAVJVoL2Lp4YtuRgjuhoZh'
);

export const themeVariables: IncomingThemeVariables = {
  dark: {
    colors: {
      bg: 'bg-[#1A1A1A]',
    },
    bellButton:
      'w-[48px] h-[48px] !bg-transparent shadow-none rounded-full transition-transform hover:scale-[1.02]',
    modal: `sm:rounded-md shadow-xl shadow-neutral-900 pt-1`,
    icons: {
      bell: Bell,
      settings: Settings,
      x: Close,
    },
    divider: `${defaultVariables.dark.divider} h-px opacity-10 mx-0`,
    notificationMessage: `${defaultVariables.dark.notificationMessage} bg-transparent`,
    notificationTimestamp: `${defaultVariables.dark.notificationTimestamp} text-left`,
    notificationsDivider: '', // Empty line is intentional to ovveride dt-hidden
  },
};

export default function DialectNotificationsButton() {
  const wallet = useWallet();
  return (
    <NotificationsButton
      wallet={wallet}
      publicKey={HOLAPLEX_MONITORING_PUBLIC_KEY}
      notifications={[{ name: 'Offer on NFT', detail: 'Event' }]}
      theme="dark"
      variables={themeVariables}
      network="localnet"
    />
  );
}
