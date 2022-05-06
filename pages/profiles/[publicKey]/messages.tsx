import Head from 'next/head';
import { GetServerSideProps, NextPage } from 'next';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { ProfileContainer } from '@/common/components/elements/ProfileContainer';
import { ProfileMessages } from '@/common/components/elements/ProfileMessages';
import {
  getPropsForWalletOrUsername,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';

import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';

import { useMailbox } from './MailboxProvider';
import { Mailbox } from '@usedispatch/client';
import { MessageAccount } from "@usedispatch/client";
import * as web3 from "@solana/web3.js";

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async context =>
  getPropsForWalletOrUsername(context);

const MessagesPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {
  const [data, setData] = useState<String>("")
  const [messages, setMessages] = useState<MessageAccount[]>([]);
  const [mailboxAddress, setMailboxAddress] = useState<web3.PublicKey | null>( null );

  const { connection } = useConnection();
  const wallet = useWallet();

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


  const fetchData = useMemo(async ()=>{
    // you can fetch data here how you like
    // whatever data you want to set use the setData(data) hook
    // setData(...) Note the Type in useState above
  }, [data])



  return (
    <ProfileDataProvider profileData={{ publicKey, ...props }}>
      <Head>
        <title>{showFirstAndLastFour(publicKey)}&apos;s profile | Holaplex</title>
        <meta
          property='description'
          key='description'
          content='View your messages in the Holaplex ecosystem.'
        />
      </Head>
      <ProfileContainer>
        <ProfileMessages publicKey={publicKey} messages={messages} mailboxAddress={mailboxAddress} mailbox={mailbox} />
        </ProfileContainer>
    </ProfileDataProvider>
  );
};

export default MessagesPage;
