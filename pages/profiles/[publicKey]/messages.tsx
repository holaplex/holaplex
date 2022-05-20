import { GetServerSideProps, NextPage } from 'next';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { ProfileMessages } from '@/common/components/elements/ProfileMessages';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { ProfilePageHead } from '../[publicKey]';
import { useMailbox } from './MailboxProvider';
import { MessageAccount } from "@usedispatch/client";
import { useEffect, useState } from 'react';
import * as web3 from "@solana/web3.js";

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

const MessagesPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {

  const [messages, setMessages] = useState<MessageAccount[]>([]);
  const [mailboxAddress, setMailboxAddress] = useState<web3.PublicKey | null>( null );

  const mailbox = useMailbox();

  useEffect(() => {

    console.log('use effect');
    if (mailbox) {
      console.log('mailbox!: ', mailbox);
      mailbox
        .getMailboxAddress()
        .then((address) => setMailboxAddress(address));

      mailbox
        .fetchMessages()
        .then((messages) => {
          console.log('messages>', messages);
          setMessages(messages);
        })
        .catch(() => {
          setMessages([]);
        });
    } else {
      console.log('no mailbox initiatlized');
    }

  }, [mailbox]);

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
    <ProfileMessages publicKey={publicKey} messages={messages} mailboxAddress={mailboxAddress} mailbox={mailbox} />
    </ProfileContainer>
  </ProfileDataProvider>
);
    }
export default MessagesPage;
