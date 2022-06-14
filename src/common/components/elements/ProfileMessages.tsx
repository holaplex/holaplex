import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { shortenAddress, showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet, useLocalStorage } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { DateTime } from 'luxon';
import { Button5 } from './Button2';
import { FailureToast } from './FailureToast';
import { SuccessToast } from './SuccessToast';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { FC, useState, useEffect, useMemo, useRef } from 'react';
import Button from '@/components/elements/Button';
import * as web3 from '@solana/web3.js';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { ProfileHandle, ProfilePFP } from '@/common/components/feed/FeedCard';
import classNames from 'classnames';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';
import { PencilAltIcon } from '@heroicons/react/outline';
import { User } from '../feed/feed.utils';

interface ProfileMessagesInterface {
  publicKey: string;
  mailbox: Mailbox | undefined;
  conversations: {
    [conversationId: string]: MessageAccount[];
  };
  mailboxAddress: web3.PublicKey | null;
  receiver?: any;
  uniqueSenders: string[];
  addMessageToConversation: (conversationId: string, msg: MessageAccount) => void;
}

export const ProfileMessages = ({ publicKey, ...props }: ProfileMessagesInterface) => {
  const [lastTxId, setLastTxId] = useState<string>('');
  const [receiver, setReceiver] = useState<string>(props.receiver ?? '');
  const [newMessageText, setNewMessageText] = useState('');
  const { mailbox, conversations, uniqueSenders, mailboxAddress, addMessageToConversation } = props;
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [messageTransactionInProgress, setmessageTransactionInProgress] = useState(false);

  const { connectedProfile } = useConnectedWalletProfile();

  const messagesInConversation = conversations[selectedConversation] ?? [];

  const recipientInput = useRef<HTMLInputElement>(null);

  const sendMessage = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!mailbox || messageTransactionInProgress) {
      alert('wallet is not connected, not sending message');
      return;
    }
    const receiverPublicKey: web3.PublicKey = new web3.PublicKey(selectedConversation);

    // TODO: can add a subject here via a new form element
    setmessageTransactionInProgress(true);
    mailbox
      .sendMessage('Holaplex chat', newMessageText, receiverPublicKey!)
      .then((tx) => {
        setLastTxId(tx);
        addMessageToConversation(selectedConversation, {
          sender: new web3.PublicKey(publicKey),
          messageId: 10, // TODO make random
          receiver: receiverPublicKey,
          data: {
            body: newMessageText,
            ts: new Date(),
          },
        } as MessageAccount);
        setNewMessageText('');
      })
      .catch((error: any) => {
        alert('send failed');
        console.log('error :', error);

        // This is how to retrieve the title and error message
        // for a popup dialog when something fails

        /* setModalInfo({
         *   title:
         *         error.error?.code === 4001
         *         ? error.error?.message
         *         : "Something went wrong",
         *   type:
         *         error.error?.code === 4001
         *         ? MessageType.warning
         *         : MessageType.error,
         * }); */
      })
      .finally(() => {
        setmessageTransactionInProgress(false);
      });
  };

  const senderTwitter: Map<String, any> = new Map();

  useEffect(() => {
    if (uniqueSenders.length > 0) {
      for (var i = 0; i < uniqueSenders.length; i++) {
        // const { data } = useTwitterHandle(null, uniqueSenders[i]);
        // senderTwitter.set(uniqueSenders[i], data);
      }
    }
  }, [uniqueSenders]);

  console.log('profile messages', {
    mailbox,
    publicKey,
    messagesInConversation,
  });
  // messages grouped by time and person
  const messageBlocks: MessageAccount[][] = createMessageBlocks(messagesInConversation);

  return (
    <div className="-mt-20 flex h-full max-h-screen  pt-20 ">
      {/* Conversations */}
      <div className="relative  flex  w-64 max-w-lg  flex-col border-t border-r border-gray-800 transition-all hover:min-w-fit lg:w-2/5 ">
        <div className="flex items-center justify-between p-5 ">
          <ProfilePFP
            user={{
              address: connectedProfile?.pubkey!,
              profile: connectedProfile?.profile,
            }}
          />
          <h1>Messages</h1>
          <span
            onClick={() => {
              // start new conversation
              setReceiver('');
              setSelectedConversation('');
              recipientInput?.current?.focus();
            }}
            className=" flex cursor-pointer items-center rounded-full p-3 shadow-lg shadow-black transition-all hover:scale-125  "
          >
            <PencilAltIcon className="h-4 w-4 text-white " aria-hidden="true" />
          </span>
        </div>
        <div className="spacy-y-6 h-full overflow-auto px-5">
          {selectedConversation !== '' && !uniqueSenders.includes(selectedConversation) && (
            <ConversationItem
              selected={true}
              user={{
                address: selectedConversation,
              }}
              onSelect={() => {
                setSelectedConversation(selectedConversation);
                setReceiver(selectedConversation);
              }}
            />
          )}
          {uniqueSenders.length ? (
            uniqueSenders.map((us) => (
              <ConversationItem
                key={us}
                selected={selectedConversation === us}
                user={{
                  address: us,
                }}
                onSelect={() => {
                  setSelectedConversation(us);
                  setReceiver(us);
                }}
              />
            ))
          ) : (
            <div className="my-auto flex grow flex-col items-center justify-center px-4">
              Start a conversation to see it appear here
            </div>
          )}
        </div>
      </div>
      {/* Messages */}
      <div className=" flex grow flex-col justify-between border-t border-gray-800 ">
        <div className="flex items-center space-x-4 border-b border-gray-800  p-5">
          {selectedConversation ? (
            <>
              <ProfilePFP
                user={{
                  address: selectedConversation,
                }}
              />
              <h2> {shortenAddress(selectedConversation)} </h2>
            </>
          ) : (
            <>
              <span>To:</span>
              <form className=" w-full">
                <input
                  onBlur={() => setSelectedConversation(receiver)}
                  autoFocus
                  type="text"
                  ref={recipientInput}
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  name="newMessageReceipient"
                  className="w-full rounded-lg border-transparent bg-gray-900 text-white focus:border-white focus:ring-white"
                  placeholder="To pubkey..."
                />
              </form>
            </>
          )}
        </div>
        <div className="h-full space-y-4 overflow-auto p-4">
          {messageBlocks.map((block, index) => (
            <MessageBlock key={index} messageBlock={block} myPubkey={publicKey} />
          ))}
        </div>

        <form
          className="mt-full flex justify-between space-x-4 border-t border-gray-800 p-5 pb-10"
          onSubmit={sendMessage}
        >
          <input
            type="text"
            name="message"
            disabled={messageTransactionInProgress}
            className="w-full rounded-lg border-transparent bg-gray-900 text-white focus:border-white focus:ring-white"
            placeholder={'Message ' + shortenAddress(selectedConversation) + '...'}
            value={newMessageText}
            onChange={(e) => setNewMessageText(e.target.value)}
          />
          <div className="top-2 right-2">
            <Button5 loading={messageTransactionInProgress} v="secondary" type="submit">
              Send
            </Button5>
          </div>
        </form>
      </div>
    </div>
  );
};

function ConversationItem(props: {
  selected: boolean;
  onSelect: () => void;
  user: User;
}): JSX.Element {
  return (
    <div
      id={props.user.address}
      className={classNames(
        ' flex cursor-pointer items-center space-x-2 rounded-md  px-2 py-2',
        props.selected && 'bg-gray-800'
      )}
      onClick={props.onSelect}
    >
      <ProfilePFP user={props.user} />

      <div className="text-base">{shortenAddress(props.user.address)}</div>
    </div>
  );
}

function Message({
  index,
  message,
  publicKey,
  conversation,
}: {
  index: number;
  publicKey: string;

  message: MessageAccount;
  conversation: MessageAccount[];
}) {
  const iAmSender = message.sender.toBase58() == publicKey;
  let cx,
    dx = '';
  if (iAmSender) {
    cx = 'text-right';
    dx = 'float-right';
  } else {
    cx = 'text-left';
    dx = 'float-left';
  }

  var nextSame = '  ';

  if (
    conversation.length < index + 1 &&
    message.sender.toBase58() == conversation[index + 1].sender.toBase58()
  ) {
    nextSame = ' hidden ';
  }

  return (
    <div key={message.messageId} className={classNames('', cx)}>
      <div
        className={
          'flex items-center justify-center whitespace-nowrap rounded-xl border-transparent bg-gray-800 px-10 py-10 text-white opacity-90 transition-all hover:opacity-100 focus:border-[#72a4e1aa] active:scale-[0.99] '
        }
      >
        <span>
          {message.data.body}
          <br />
          {message.data.ts && String(message.data.ts.toDateString())}
        </span>
      </div>
      <div className={'inline-block ' + dx + nextSame}>
        <ProfilePFP user={{ address: message.sender.toBase58() }} />
      </div>
    </div>
  );
}

function MessageBlock(props: { myPubkey: string; messageBlock: MessageAccount[] }) {
  const sender = props.messageBlock[0].sender.toBase58();
  const iAmSender = sender === props.myPubkey;
  const msgIsForMe = !iAmSender;

  const ts = props.messageBlock[0].data.ts;
  const timestamp = ts ? DateTime.fromJSDate(ts).toRelative() : null;

  const [firstMsg, ...rest] = props.messageBlock;
  const msgBaseClasses = classNames(
    'px-6 py-4 rounded-full',
    msgIsForMe ? 'bg-gray-800 text-white ml-4' : 'bg-white text-black mr-4'
  );

  const lastMsgIndex = rest.length - 1;

  return (
    <div className={classNames('flex items-end ', iAmSender ? 'flex-row-reverse' : '')}>
      <ProfilePFP user={{ address: sender }} />
      <div
        className={classNames(
          'flex flex-col  space-y-2   text-white opacity-90',
          msgIsForMe ? 'items-start' : 'items-end'
        )}
      >
        {ts && <div className="ml-6 text-xs text-gray-300">{timestamp}</div>}
        <div
          className={classNames(msgBaseClasses, msgIsForMe ? 'rounded-bl-none' : 'rounded-br-none')}
        >
          {firstMsg.data.body}
        </div>
        {rest.map((msg, i) => (
          <div
            key={msg.messageId + msg.data.body}
            className={classNames(
              msgBaseClasses,
              i !== lastMsgIndex ? (msgIsForMe ? 'rounded-l-none' : 'rounded-r-none') : null,
              i !== 0 && i === lastMsgIndex
                ? msgIsForMe
                  ? 'rounded-tl-none'
                  : 'rounded-tr-none'
                : null
            )}
          >
            {msg.data.body}
          </div>
        ))}
      </div>
    </div>
  );
}

function createMessageBlocks(messagesInConversation: MessageAccount[]) {
  const messageBlocks: MessageAccount[][] = [];
  let currentBlock = 0;

  messagesInConversation.forEach((curMsg, i, conversation) => {
    const nextMsg = conversation[i + 1];
    if (
      curMsg.sender.toBase58() === nextMsg?.sender.toBase58() ||
      !nextMsg
      // && // same sender
      // nextMsg.data.ts &&
      // curMsg.data.ts &&
      // nextMsg.data.ts.getTime() - curMsg.data.ts.getTime() < 4 * 3600_000 // less than 4 hours apart
    ) {
      if (!messageBlocks[currentBlock]) {
        messageBlocks[currentBlock] = [];
      }

      messageBlocks[currentBlock].push(curMsg);
    } else {
      messageBlocks.push([curMsg]);
      currentBlock++;
    }
  }, []);

  console.log('Message blocks', {
    messagesInConversation,
    messageBlocks,
  });

  return messageBlocks;
}
