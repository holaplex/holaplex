import { useCallback, useEffect, useState, VFC } from 'react';
import ReactDom from 'react-dom';
import { HomeSection, HomeSectionCarousel } from 'pages/index';
import { ProfilePreviewData } from '@/types/types';
import { useFeaturedProfilesQuery } from 'src/graphql/indexerTypes';
import { FollowUnfollowButton } from '../../components/FollowUnfollowButton';
import { useConnection, useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import classNames from 'classnames';
import { useConnectedWalletProfile } from 'src/views/_global/ConnectedWalletProfileProvider';
import Modal from '../../components/Modal';
import { Button5 } from '../../components/Button2';
import { useMultiTransactionModal } from 'src/views/_global/MultiTransaction';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import ProfilePreview from '../../components/ProfilePreview';

const CAROUSEL_ROWS: number = 2;
const CAROUSEL_COLS: number = 3;
const CAROUSEL_PAGES: number = 2;
const N_LISTINGS: number = CAROUSEL_ROWS * CAROUSEL_COLS * CAROUSEL_PAGES;

//TODO remove once other profiles have enough followers to preclude this one in the backend
const DISALLOWED_PROFILES: string[] = ['ho1aVYd4TDWCi1pMqFvboPPc3J13e4LgWkWzGJpPJty'];

const FeaturedProfilesSection: VFC = () => {
  const wallet: WalletContextState = useWallet();
  // initial value hack to get loading card
  // TODO pass in a loading boolean to bypass loading until the address is known
  const [featuredProfiles, setFeaturedProfiles] = useState<ProfilePreviewData[]>(
    [...Array(N_LISTINGS)].map((_) => ({ address: '', profile: {}, nftCounts: {} }))
  );

  const dataQuery = useFeaturedProfilesQuery({
    variables: {
      userWallet: wallet?.publicKey,
      limit: CAROUSEL_PAGES * CAROUSEL_COLS * CAROUSEL_ROWS,
    },
  });

  // get featured profiles once on page load and anytime later when the wallet has been (dis)connected
  // by making the wallet pubkey one of the dependencies
  useEffect(() => {
    if (dataQuery.data?.followWallets && dataQuery.data.followWallets.length > 0) {
      const profilesToShow = (dataQuery.data.followWallets as ProfilePreviewData[]).filter(
        (p) => !DISALLOWED_PROFILES.includes(p.address)
      );
      setFeaturedProfiles(profilesToShow);
    }
  }, [wallet?.publicKey, setFeaturedProfiles, dataQuery.data?.followWallets]);

  // when the server returns a profile with insufficient data to display the
  //  preview, remove it from the carousel
  const onInsufficientDataForAProfile = useCallback<(profileAddress: string) => void>(
    (profileAddress) => {
      setFeaturedProfiles(featuredProfiles.filter((p) => p.address !== profileAddress));
    },
    [featuredProfiles]
  );

  return (
    <HomeSection>
      <HomeSection.Header>
        <HomeSection.Title>Profiles to follow</HomeSection.Title>
        {/* //TODO revert once discovery is ready  */}
        {/* <HomeSection.HeaderAction external href="https://google.com">
          Discover All
        </HomeSection.HeaderAction> */}
      </HomeSection.Header>
      <HomeSection.Body>
        <HomeSectionCarousel rows={CAROUSEL_ROWS} cols={CAROUSEL_COLS}>
          {featuredProfiles.map((s) => (
            <HomeSectionCarousel.Item key={s.address} className="p-4">
              <ProfilePreview
                address={s.address}
                data={s}
                onInsufficientData={onInsufficientDataForAProfile}
              />
            </HomeSectionCarousel.Item>
          ))}
        </HomeSectionCarousel>
      </HomeSection.Body>
    </HomeSection>
  );
};

export const FollowUnfollowButtonDataWrapper: VFC<{ targetPubkey: string; className?: string }> = ({
  targetPubkey,
  className,
}) => {
  const { connectedProfile } = useConnectedWalletProfile();

  const userIsFollowingThisAccount = connectedProfile?.following?.find(
    (f) => f.address === targetPubkey
  );

  const targetIsUserWallet = targetPubkey === connectedProfile?.pubkey;

  const canAssessFollowState: boolean = !!connectedProfile && !targetIsUserWallet;

  const hideButton: boolean = targetIsUserWallet || !canAssessFollowState;

  if (hideButton) {
    return null; // <ConnectAndFollowButton />;
  }

  return (
    <FollowUnfollowButton
      source="modalFollowing"
      type={userIsFollowingThisAccount ? 'Unfollow' : 'Follow'}
      toProfile={{
        address: targetPubkey,
      }}
      className={classNames(className, { hidden: hideButton })}
    />
  );
};

export default FeaturedProfilesSection;

// WIP: Ignore for now
function ConnectAndFollowButton() {
  const [showModal, setShowModal] = useState(false);

  const { connection } = useConnection();

  const { runActions } = useMultiTransactionModal();
  const { setVisible } = useWalletModal();

  async function connectWalletPromise() {
    setVisible(true);

    await waitUserInput();

    return;
  }

  const timeout = async (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function waitUserInput() {
    while (!connection) await timeout(1000); // pauses script
    // next = false; // reset var
  }

  return (
    <div>
      {ReactDom.createPortal(
        <Modal priority title={'Connect and Follow'} open={showModal} setOpen={setShowModal}>
          <p>
            You&apos;ll get two wallet prompts, one to connect and one to confirm the follow
            transaction
          </p>
          <p>When you are connected in the future, you won&apos;t receive this message</p>
          <Button5
            onClick={() =>
              runActions([
                {
                  id: 'Connect',
                  name: 'Connecting wallet',
                  action: connectWalletPromise,
                  param: null,
                },
              ])
            }
            v="primary"
          >
            Connect and Follow
          </Button5>
        </Modal>,
        document.getElementsByTagName('body')[0]!
      )}
      <Button5 v="primary" onClick={() => setShowModal(true)}>
        Follow
      </Button5>
    </div>
  );
}
