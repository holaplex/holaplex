import { GetServerSideProps, NextPage } from 'next';
import { ProfileMessages } from '@/common/components/elements/ProfileMessages';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { ProfilePageHead } from './profiles/[publicKey]';
import { ReactNode, useEffect, useState } from 'react';
import * as web3 from '@solana/web3.js';
import { useMailbox } from '@/common/context/MailboxProvider';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { useWallet } from '@solana/wallet-adapter-react';

const MessagesPage: NextPage<WalletDependantPageProps> = () => {
  const [conversations, setConversations] = useState<Map<string, MessageAccount[]>>(new Map());
  const [uniqueSenders, setUniqueSenders] = useState<string[]>([]);
  const [mailboxAddress, setMailboxAddress] = useState<web3.PublicKey | null>(null);
  const wallet = useWallet();
  const myPubkey = wallet.publicKey?.toBase58();

  const mailbox = useMailbox();

  async function setupConversations(mb: Mailbox) {
    const allConversations = new Map<string, MessageAccount[]>();

    const mbAddress = await mb.getMailboxAddress();
    setMailboxAddress(mbAddress);

    const allReceivedMessages = await mb.fetchMessages();

    const uniqueSenders = [
      ...new Set(allReceivedMessages.map((message) => message.sender.toBase58())),
    ];

    const allMySentMessages = await Promise.all(
      uniqueSenders.map((u) => mb.fetchSentMessagesTo(new web3.PublicKey(u)))
    );

    uniqueSenders.forEach((senderAddress, i) => {
      allConversations.set(
        senderAddress,
        [
          ...allMySentMessages[i],
          ...allReceivedMessages.filter(
            // Are we not always the receiver anyway?
            (m) => m.receiver.toBase58() === myPubkey && m.sender.toBase58() === senderAddress
          ),
        ].sort((a, b) => {
          if (new Date(String(a.data.ts)).getTime() > new Date(String(b.data.ts)).getTime()) {
            return -1;
          }

          if (new Date(String(a.data.ts)).getTime() < new Date(String(b.data.ts)).getTime()) {
            return -1;
          }

          return 0;
        })
      );

      console.log('allConversations', allConversations);
      setUniqueSenders(uniqueSenders);
      setConversations(allConversations);
    });
  }

  useEffect(() => {
    if (mailbox) {
      setupConversations(mailbox);
    } else {
      console.log('no mailbox initiatlized');
    }
  }, [mailbox]);

  return !myPubkey ? null : (
    <ProfileMessages
      publicKey={myPubkey}
      conversations={conversations}
      mailboxAddress={mailboxAddress}
      mailbox={mailbox}
      uniqueSenders={uniqueSenders}
    />
  );
};
export default MessagesPage;
