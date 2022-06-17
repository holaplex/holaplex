import { GetServerSideProps, NextPage } from 'next';
import { ProfileMessages } from '@/common/components/messages/ProfileMessages';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';

import { ReactNode, useEffect, useState } from 'react';
import * as web3 from '@solana/web3.js';
import { useMailbox } from '@/common/context/MailboxProvider';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';
import { DateTime } from 'luxon';

interface Conversations {
  [conversationId: string]: MessageAccount[];
}

const MessagesPage: NextPage<WalletDependantPageProps> = () => {
  const [uniqueSenders, setUniqueSenders] = useState<string[]>([]);
  const [mailboxAddress, setMailboxAddress] = useState<web3.PublicKey | null>(null);
  const wallet = useWallet();
  const myPubkey = wallet.publicKey?.toBase58();

  // const [conversationsStorage, setConversations] = useLocalStorage<Map<string, MessageAccount[]>>(
  //   'conversationsState',
  //   new Map()
  // );

  // const conversations = new Map(Object.entries(conversationsStorage));
  // const [conversations, setConversations] = useState<Map<string, MessageAccount[]>>(new Map());
  // const [conversations, setConversations] = useState<Conversations>({});
  const [conversationsst, setConversations] = useLocalStorage<Conversations>(
    'conversationsState',
    {}
  );

  const conversations = Object.entries(conversationsst).reduce((acc, [recipientId, messages]) => {
    acc[recipientId] = messages.map((m) => ({
      ...m,
      data: {
        ...m.data,
        ts: m.data.ts && new Date(m.data.ts),
      },
      receiver: new web3.PublicKey(m.receiver),
      sender: new web3.PublicKey(m.sender),
    }));
    return acc;
  }, {} as Conversations);

  function addMessageToConversation(conversationId: string, msg: MessageAccount) {
    setConversations((prevState) => {
      return {
        ...prevState,
        [conversationId]: [
          ...(prevState[conversationId] ?? []), // need the ?? [] to account for new conversations
          msg,
        ],
      };
    });
  }
  const mailbox = useMailbox();

  const router = useRouter();

  const sendToAddress = router.query.to ?? '';

  async function setupConversations(mb: Mailbox) {
    console.log('Setting up conversations');
    const allConversations: Conversations = {}; // new Map<string, MessageAccount[]>();

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
      // allConversations.set(
      //   senderAddress,
      //   [
      //     ...allMySentMessages[i],
      //     ...allReceivedMessages.filter(
      //       // Are we not always the receiver anyway?
      //       (m) => m.receiver.toBase58() === myPubkey && m.sender.toBase58() === senderAddress
      //     ),
      //   ].sort((a, b) => {
      //     if (new Date(String(a.data.ts)).getTime() > new Date(String(b.data.ts)).getTime()) {
      //       return -1;
      //     }

      //     if (new Date(String(a.data.ts)).getTime() < new Date(String(b.data.ts)).getTime()) {
      //       return -1;
      //     }

      //     return 0;
      //   })
      // );

      allConversations[senderAddress] = [
        ...allMySentMessages[i],
        ...allReceivedMessages.filter(
          // Are we not always the receiver anyway?
          (m) => m.receiver.toBase58() === myPubkey && m.sender.toBase58() === senderAddress
        ),
      ].sort((a, b) => {
        if (!a.data.ts) return 1;
        if (!b.data.ts) return -1;

        return a.data.ts.getTime() - b.data.ts.getTime();
      });
    });
    console.log('allConversations', allConversations);
    setUniqueSenders(uniqueSenders);
    setConversations({
      ...conversations,
      ...allConversations,
    });
  }

  useEffect(() => {
    if (mailbox) {
      setupConversations(mailbox);
    } else {
      console.log('no mailbox initiatlized');
    }
  }, [mailbox]);

  return !myPubkey || !mailbox ? null : (
    <ProfileMessages
      publicKey={myPubkey}
      conversations={conversations}
      mailboxAddress={mailboxAddress}
      mailbox={mailbox}
      uniqueSenders={uniqueSenders}
      receiver={sendToAddress}
      addMessageToConversation={addMessageToConversation}
    />
  );
};
export default MessagesPage;

// make a ticket for fetching multiple wallet profiles based on a list of addressess

// stretch goal: setup a message listeners
