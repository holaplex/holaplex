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
import { Button5 } from '../elements/Button2';
import { FailureToast } from '../elements/FailureToast';
import { SuccessToast } from '../elements/SuccessToast';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { FC, useState, useEffect, useMemo, useRef, Fragment } from 'react';
import Button from '@/components/elements/Button';
import * as web3 from '@solana/web3.js';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { ProfileHandle, ProfilePFP } from '@/common/components/feed/FeedCard';
import classNames from 'classnames';
import { useConnectedWalletProfile } from '@/common/context/ConnectedWalletProfileProvider';
import { PencilAltIcon } from '@heroicons/react/outline';
import { User } from '../feed/feed.utils';
import { Combobox } from '@headlessui/react';
import { useProfileSearchLazyQuery, ProfileSearchQuery } from 'src/graphql/indexerTypes';
import { DebounceInput } from 'react-debounce-input';
import { ProfileSearchItem } from '../search/SearchItems';
import { Avatar } from '../elements/Avatar';
import ProfileSearchCombobox from './ProfileSearchCombobox';

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
  const [recipient, setRecipient] = useState<User | null>(null);

  useEffect(() => {
    if (props.receiver && !recipient) {
      setRecipient({
        address: props.receiver,
      });
    }
  }, [props.receiver]);
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

    if (!recipient) return;
    const receiverPublicKey: web3.PublicKey = new web3.PublicKey(recipient.address);

    // TODO: can add a subject here via a new form element
    setmessageTransactionInProgress(true);
    mailbox
      .sendMessage('Holaplex chat', newMessageText, receiverPublicKey!)
      .then((tx) => {
        setLastTxId(tx);
        addMessageToConversation(recipient.address, {
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

  // messages grouped by time and person
  const messageBlocks: MessageAccount[][] = createMessageBlocks(messagesInConversation);

  return (
    <div className="-mt-20 flex h-full max-h-screen  pt-20 ">
      {/* Conversations / Contacts */}
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
              setRecipient(null);
              recipientInput?.current?.focus();
            }}
            className=" flex cursor-pointer items-center rounded-full p-3 shadow-lg shadow-black transition-all hover:scale-125  "
          >
            <PencilAltIcon className="h-4 w-4 text-white " aria-hidden="true" />
          </span>
        </div>
        <div className="spacy-y-6 h-full overflow-auto px-5">
          {recipient && !uniqueSenders.includes(recipient.address) && (
            <Contact selected={true} user={recipient} />
          )}
          {uniqueSenders.length ? (
            uniqueSenders.map((us) => (
              <Contact
                key={us}
                selected={selectedConversation === us}
                user={{
                  address: us,
                }}
                onSelect={() => {
                  setSelectedConversation(us);
                  setReceiver(us);
                  setRecipient({
                    address: us,
                  });
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
          {recipient ? (
            <>
              <ProfilePFP user={recipient} />
              <h2> {recipient.profile?.handle || shortenAddress(recipient.address)} </h2>
            </>
          ) : (
            <>
              <span>To:</span>
              <div className="w-full">
                <ProfileSearchCombobox setRecipient={setRecipient} />
              </div>
              {/* <form className=" w-full">
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
              </form> */}
            </>
          )}
        </div>
        <div className="h-full space-y-4 overflow-auto p-4">
          {messageBlocks.map((block, index) => (
            <MessageBlock key={index} messageBlock={block} myPubkey={publicKey} />
          ))}
        </div>

        <form
          className="mt-full flex items-center justify-between space-x-4 border-t border-gray-800 p-5 pb-10"
          onSubmit={sendMessage}
        >
          <textarea
            name="message"
            disabled={messageTransactionInProgress}
            className="w-full resize-none rounded-lg  bg-gray-900 px-4 py-2 text-white ring-1  ring-gray-800  focus:ring-white"
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

function Contact(props: { selected: boolean; onSelect?: () => void; user: User }): JSX.Element {
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

      <div className="text-base">
        {props.user.profile?.handle ?? shortenAddress(props.user.address)}
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
    msgIsForMe ? 'bg-gray-800 text-white ml-4' : ' text-black mr-4',
    iAmSender && 'bg-colorful-gradient bg-repeat-round '
  );

  const lastMsgIndex = rest.length - 1;

  return (
    <div className={classNames('flex items-end ', iAmSender ? 'flex-row-reverse' : '')}>
      <ProfilePFP user={{ address: sender }} />
      <div
        className={classNames(
          'flex flex-col  space-y-2   text-white opacity-90',
          msgIsForMe ? 'items-start' : 'items-end '
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
      (curMsg.sender.toBase58() === nextMsg?.sender.toBase58() || !nextMsg) && // same sender
      nextMsg?.data.ts &&
      curMsg.data.ts &&
      nextMsg?.data.ts.getTime() - curMsg.data.ts.getTime() < 4 * 3600_000 // less than 4 hours apart
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

  return messageBlocks;
}
