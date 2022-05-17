import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Spinner } from '@/common/components/elements/Spinner';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) => {
  const result = await getProfileServerSideProps(context);
  if ((result as { redirect?: boolean }).redirect) {
    return result;
  } else {
    const { props } = result as { props: WalletDependantPageProps };
    return { redirect: { destination: `/profiles/${props.publicKey}/nfts`, statusCode: 302 } };
  }
}; // Do server side redirection for SEO purposes.

export const ProfilePageHead = (props: {
  publicKey: string;
  twitterProfile?: {
    twitterHandle?: string | null;
    pfp?: string;
    banner?: string;
  };
  description: string;
}) => {
  const handle = props.twitterProfile?.twitterHandle
    ? '@' + props.twitterProfile?.twitterHandle
    : showFirstAndLastFour(props.publicKey);

  const description = props.description;
  const title = `${handle}'s profile | Holaplex`;
  return (
    <Head>
      <title>{handle}&apos;s profile | Holaplex</title>
      <meta property="description" key="description" content={props.description} />
      <meta property="image" key="image" content={props.twitterProfile?.banner} />
      {/* Schema */}
      <meta itemProp="name" content={title} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={props.twitterProfile?.banner} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image:src" content={props.twitterProfile?.banner} />
      <meta name="twitter:site" content="@holaplex" />
      {/* Open Graph */}
      <meta name="og-title" content={title} />
      <meta name="og-description" content={description} />
      <meta name="og-image" content={props.twitterProfile?.banner} />
      <meta name="og-url" content={`https://holaplex.com/profiles/${props.publicKey}/nfts`} />
      <meta name="og-site_name" content="Holaplex" />
      <meta name="og-type" content="product" />
    </Head>
  );
};

const ActivityLanding: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/profiles/${publicKey}/nfts`);
    // Run once if client-side
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ProfileDataProvider profileData={{ publicKey, ...props }}>
      <ProfilePageHead
        publicKey={publicKey}
        twitterProfile={{
          twitterHandle: props.twitterHandle,
          banner: props.banner,
          pfp: props.profilePicture,
        }}
        description="View activity for this, or any other pubkey, in the Holaplex ecosystem."
      />
      <ProfileContainer>
        <div className="flex h-48 w-full items-center justify-center">
          <Spinner />
        </div>
      </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default ActivityLanding;
