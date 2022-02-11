import { ActivityContent } from '@/common/components/elements/ActivityContent';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useAppHeaderSettings } from '@/common/components/elements/AppHeaderSettingsProvider';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { PublicKey } from '@solana/web3.js';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      wallet: context.query.wallet,
    },
  };
};

const ActivityLanding = ({ wallet }: { wallet: string }) => {
  const router = useRouter();
  const publicKey = wallet ? new PublicKey(wallet as string) : null;
  const { toggleDisableMarginBottom } = useAppHeaderSettings();
  const [didToggleDisableMarginBottom, setDidToggleDisableMarginBottom] = useState(false);

  useEffect(() => {
    if (!didToggleDisableMarginBottom) {
      setDidToggleDisableMarginBottom(true);
      toggleDisableMarginBottom();
    }
  }, [didToggleDisableMarginBottom, toggleDisableMarginBottom]);

  return (
    <>
      <Head>
        <title>{showFirstAndLastFour(wallet)}&apos;s profile | Holaplex</title>
        <meta
          property="description"
          key="description"
          content="View activity for this, or any other pubkey, in the Holaplex ecosystem."
        />
      </Head>
      <ProfileContainer wallet={wallet} publicKey={publicKey}>
        <ActivityContent publicKey={publicKey} />
      </ProfileContainer>
    </>
  );
};

export default ActivityLanding;
