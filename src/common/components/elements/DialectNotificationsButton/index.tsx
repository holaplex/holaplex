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
import { useAnalytics } from '@/common/context/AnalyticsProvider';

const HOLAPLEX_MONITORING_PUBLIC_KEY = new PublicKey(
  'BpVYWaAPbv5vyeRxiX9PMsmAVJVoL2Lp4YtuRgjuhoZh'
);

export const themeVariables: IncomingThemeVariables = {
  dark: {
    colors: {
      bg: 'bg-[#1A1A1A]',
    },

    modal: `sm:rounded-md shadow-xl shadow-neutral-900 pt-1 leading-normal`,
    icons: {
      bell: Bell,
      settings: Settings,
      x: Close,
    },
    divider: `${defaultVariables.dark.divider} h-px opacity-10 mx-0`,
    notificationMessage: `${defaultVariables.dark.notificationMessage} bg-transparent`,
    notificationTimestamp: `${defaultVariables.dark.notificationTimestamp} text-left`,
    notificationsDivider: '', // Empty line is intentional to override dt-hidden
  },
};

export default function DialectNotificationsButton() {
  const wallet = useWallet();

  const { track } = useAnalytics();

  const notificationBellTarget = document.querySelectorAll(
    '[d="M15 6.667a5 5 0 0 0-10 0c0 5.833-2.5 7.5-2.5 7.5h15S15 12.5 15 6.667ZM11.442 17.5a1.666 1.666 0 0 1-2.884 0"]'
  )[0];

  return (
    <div
      onClick={(e) => {
        if (e.target === notificationBellTarget) {
          track('Notification Bell clicked', {
            event_category: 'Global',
            event_label: 'Dialect notification',
          });
        }
      }}
    >
      <NotificationsButton
        wallet={wallet}
        publicKey={HOLAPLEX_MONITORING_PUBLIC_KEY}
        notifications={[{ name: 'Offer on NFT', detail: 'Event' }]}
        rpcUrl={process.env.NEXT_PUBLIC_SOLANA_ENDPOINT}
        theme="dark"
        variables={themeVariables}
        network="mainnet"
        channels={['web3', 'email', 'telegram', 'sms']}
      />
    </div>
  );
}
