import { NextPage } from 'next';
import { ProfileMessages } from '@/common/components/messages/ProfileMessages';
import { WalletDependantPageProps } from '@/modules/server-side/getProfile';

import { useEffect, useMemo, useState } from 'react';
import * as web3 from '@solana/web3.js';
import { useMailbox } from '@/common/context/MailboxProvider';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useLocalStorage } from '@/common/hooks/useLocalStorage';

interface Conversations {
  [conversationId: string]: MessageAccount[];
}

const MessagesPage: NextPage<WalletDependantPageProps> = () => {
  const wallet = useWallet();
  const myPubkey = wallet.publicKey?.toBase58();

  // load existing conversations from local storage to display conversations where the other party has not replied yet
  const [conversationsState, setConversationsState] = useLocalStorage<Conversations>(
    'conversationsState',
    {}
  );

  // map conversationState back into web3 form to account for transformations that happens when pubkeys and dates go into localstorage
  const conversations = useMemo(
    () =>
      Object.entries(conversationsState).reduce((acc, [recipientId, messages]) => {
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
      }, {} as Conversations),
    [conversationsState]
  );

  function addMessageToConversation(conversationId: string, msg: MessageAccount) {
    setConversationsState((prevState) => {
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
  // used to initialize inbox with a recipient
  const receiverAddress = router.query.to as string | undefined;

  async function setupConversations(mb: Mailbox) {
    const allConversations: Conversations = {};
    const allReceivedMessages = await mb.fetchMessages();

    const uniqueSenders = [
      ...new Set(allReceivedMessages.map((message) => message.sender.toBase58())),
    ];

    const allMySentMessages = await Promise.all(
      uniqueSenders.map((u) => mb.fetchSentMessagesTo(new web3.PublicKey(u)))
    );

    // merge and sort messages pr conversation
    uniqueSenders.forEach((senderAddress, i) => {
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
    setConversationsState({
      ...conversations,
      ...allConversations,
    });
  }

  useEffect(() => {
    if (mailbox) {
      setupConversations(mailbox);
    }
  }, [mailbox]);

  return !myPubkey || !mailbox ? null : (
    <ProfileMessages
      publicKey={myPubkey}
      conversations={conversations}
      mailbox={mailbox}
      receiverAddress={receiverAddress}
      addMessageToConversation={addMessageToConversation}
    />
  );
};
export default MessagesPage;
