import { NextPage } from 'next';
import { ProfileMessages } from 'src/views/messages/ProfileMessages';

import { useEffect, useMemo, useState } from 'react';
import * as web3 from '@solana/web3.js';
import { useMailbox } from 'src/views/messages/MailboxProvider';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useConnectedWalletProfile } from 'src/views/_global/ConnectedWalletProfileProvider';
import { CONVERSATIONS_STATE } from '@/views/_global/localStorageKeys';
import { WalletDependantPageProps } from '@/views/profiles/getProfileServerSideProps';

interface Conversations {
  [conversationId: string]: MessageAccount[];
}

const MessagesPage: NextPage<WalletDependantPageProps> = () => {
  const { connectedProfile } = useConnectedWalletProfile();
  const myPubkey = connectedProfile?.pubkey;
  const mailbox = useMailbox();
  const router = useRouter();
  // used to initialize inbox with a recipient
  const receiverAddress = router.query.to as string | undefined;

  // load existing conversations from local storage to display conversations where the other party has not replied yet
  const [conversationsState, setConversationsState] = useLocalStorage<Conversations>(
    CONVERSATIONS_STATE,
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

  async function setUpConversations(mailbox: Mailbox) {
    const allConversations: Conversations = {};
    const allReceivedMessages = await mailbox.fetchMessages();

    const uniqueSenders = [
      ...new Set(allReceivedMessages.map((message) => message.sender.toBase58())),
    ];

    const allMySentMessages = await Promise.all(
      uniqueSenders.map((u) => mailbox.fetchSentMessagesTo(new web3.PublicKey(u)))
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
      setUpConversations(mailbox);
    }
  }, [mailbox]);

  return !myPubkey || !mailbox ? null : (
    <ProfileMessages
      myPubkey={myPubkey}
      conversations={conversations}
      mailbox={mailbox}
      receiverAddress={receiverAddress}
      addMessageToConversation={addMessageToConversation}
    />
  );
};
export default MessagesPage;
