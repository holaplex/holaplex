import { useAnalytics } from 'src/views/_global/AnalyticsProvider';
import { shortenAddress } from '@/modules/utils/string';
import { DateTime } from 'luxon';
import { Button5 } from '@/components/Button2';
import React, { useState, useEffect, useMemo, useRef, RefObject } from 'react';
import * as web3 from '@solana/web3.js';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { ProfilePFP } from 'src/views/alpha/FeedCard';
import clsx from 'clsx';
import { useConnectedWalletProfile } from 'src/views/_global/ConnectedWalletProfileProvider';
import { PencilAltIcon } from '@heroicons/react/outline';
import { User } from '../alpha/feed.utils';
import { useGetProfilesQuery } from 'src/graphql/indexerTypes';
import ProfileSearchCombobox from './ProfileSearchCombobox';

interface ProfileMessagesInterface {
  myPubkey: string;
  mailbox: Mailbox;
  conversations: {
    [conversationId: string]: MessageAccount[];
  };
  receiverAddress?: string;
  addMessageToConversation: (conversationId: string, msg: MessageAccount) => void;
}

function groupMessages(messagesInConversation: MessageAccount[]) {
  const THRESHOLD_TO_GROUP_MESSAGES_MS = 4 * 3600_000;
  const messageBlocks: MessageAccount[][] = [];
  let currentBlockIndex = -1; // I think there might be a better way to do this, but I'm blanking

  messagesInConversation.forEach((curMsg, i, conversation) => {
    const prevMsg = i === 0 ? null : conversation[i - 1];

    const timeOfPrevMsg = prevMsg?.data?.ts?.getTime();
    const timeOfCurMsg = curMsg.data?.ts?.getTime();

    const prevSenderIsSame = prevMsg?.sender.toBase58() == curMsg.sender.toBase58();
    const messageIsWithin4HoursOfLast =
      timeOfCurMsg && timeOfPrevMsg && timeOfCurMsg - THRESHOLD_TO_GROUP_MESSAGES_MS;

    const shouldGroupWithPrevious = prevSenderIsSame && messageIsWithin4HoursOfLast;

    if (shouldGroupWithPrevious) {
      // add to current msg block
      if (!messageBlocks[currentBlockIndex]) {
        messageBlocks[currentBlockIndex] = [];
      }

      messageBlocks[currentBlockIndex].push(curMsg);
    } else {
      // create a new msg block
      messageBlocks.push([curMsg]);
      currentBlockIndex++;
    }
  }, []);

  return messageBlocks;
}

export function ProfileMessages(props: ProfileMessagesInterface) {
  // Some notes for the future
  // 1. This is more email than IM, from Dispatch's point of view anyway.
  // 2. The messages listener can be used to notify people of new messages (as long as they stay on the site.). Should probably be put in the provider. Might be possible to integrate with dialect or notify in the future
  // 3. TODO: Add in delete messages
  const [newMessageText, setNewMessageText] = useState('');
  const [recipient, setRecipient] = useState<User | null>(null);
  const [messageTransactionInProgress, setMessageTransactionInProgress] = useState(false);

  const contacts = Object.keys(props.conversations);

  useEffect(() => {
    if (props.receiverAddress && !recipient) {
      setRecipient({
        address: props.receiverAddress,
      });
    }
  }, [props.receiverAddress]);

  const { connectedProfile } = useConnectedWalletProfile();

  const messagesInConversation: MessageAccount[] =
    (recipient?.address && props.conversations[recipient.address]) || [];

  const recipientInput = useRef<HTMLInputElement>(null);
  const newMessageInput = useRef<HTMLTextAreaElement | HTMLInputElement>(null);

  const { data } = useGetProfilesQuery({
    variables: {
      addresses: contacts,
    },
  });

  const enrichedContacts: User[] = useMemo(
    () =>
      (
        data?.wallets.slice() || // We need to do the sorting on a copy of the list returned from the query
        contacts.map((c) => ({
          address: c,
        }))
      ).sort((c1, c2) => {
        const conversation1 = props.conversations[c1.address];
        const conversation2 = props.conversations[c2.address];
        console.log('ec', {
          c: props.conversations,
          conversation1,
          conversation2,
        });
        if (
          !conversation1 ||
          !conversation1.length || // You'd think a conversation would always have lenght, but dispatch actually returned an empty array for an earlier conversation
          !conversation2 ||
          !conversation2.length
        )
          return 0;

        const timeOfLastMessageInConvo1 =
          conversation1[conversation1.length - 1].data.ts?.getTime();
        const timeOfLastMessageInConvo2 =
          conversation2[conversation2.length - 1].data.ts?.getTime();

        return timeOfLastMessageInConvo1 && timeOfLastMessageInConvo2
          ? timeOfLastMessageInConvo2 - timeOfLastMessageInConvo1
          : 0;
      }),

    [data?.wallets, contacts]
  );

  async function sendMessage(event: React.SyntheticEvent) {
    event.preventDefault();

    if (!recipient) return;
    const receiverPublicKey: web3.PublicKey = new web3.PublicKey(recipient.address);

    // TODO: can add a subject here via a new form element
    setMessageTransactionInProgress(true);

    props.mailbox
      .sendMessage(
        // Keeping this as Holaplex chat for now, but could be moved to empty string or something user defined in the future
        'Holaplex chat',
        newMessageText,
        receiverPublicKey!,
        {}, // options // might be used in the future to add attatchements to message
        {
          ns: 'holaplex', // should be lowercase
        }
      )
      .then((tx) => {
        const lastMessage = messagesInConversation.at(-1);
        props.addMessageToConversation(recipient.address, {
          sender: new web3.PublicKey(props.myPubkey),
          messageId: lastMessage ? lastMessage.messageId + 1 : 0,
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
        // TODO
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
        setMessageTransactionInProgress(false);
      });
  }

  // messages grouped by time and person
  const messageBlocks: MessageAccount[][] = messagesInConversation.length
    ? groupMessages(messagesInConversation)
    : [];

  return (
    <div className="-mt-20 flex h-full max-h-screen  pt-20 ">
      {/*  Contacts sidebar */}
      <div className="relative  flex  w-full  max-w-md flex-col border-t border-r border-gray-800 transition-all hover:min-w-fit ">
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
              setRecipient(null);
              recipientInput?.current?.focus();
            }}
            className=" flex cursor-pointer items-center rounded-full p-3 shadow-lg shadow-black transition-all hover:scale-125  "
          >
            <PencilAltIcon className="h-4 w-4 text-white " aria-hidden="true" />
          </span>
        </div>
        <div className="spacy-y-6 h-full overflow-auto px-5">
          {recipient && !enrichedContacts.some((c) => c.address === recipient.address) && (
            // Create a temporary contact card while typing in a messsage for a new recipient
            <Contact selected={true} user={recipient} />
          )}
          {enrichedContacts.length ? (
            enrichedContacts.map((contact) => (
              <Contact
                key={contact.address}
                selected={recipient?.address === contact.address}
                user={contact}
                onSelect={() => {
                  setRecipient(contact);
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
      {/* Conversation main view */}
      <div className=" flex grow flex-col justify-between border-t border-gray-800 ">
        <div className="flex items-center space-x-4 border-b border-gray-800  p-5">
          {recipient ? (
            <>
              <ProfilePFP user={recipient} />
              <h2> {recipient.profile?.handle ?? shortenAddress(recipient.address)} </h2>
            </>
          ) : (
            <>
              <span>To:</span>
              <div className="w-full">
                <ProfileSearchCombobox
                  setRecipient={(r: User) => {
                    setRecipient(r);
                    newMessageInput.current?.focus();
                  }}
                />
              </div>
            </>
          )}
        </div>
        <div className="h-full space-y-4 overflow-auto p-4">
          {messageBlocks.map((block, index) => (
            <MessageBlock key={index} messageBlock={block} myPubkey={props.myPubkey} />
          ))}
          {messagesInConversation.length &&
          messagesInConversation.every((m) => m.sender.toBase58() === props.myPubkey) &&
          recipient ? (
            <div className="mx-auto max-w-md rounded-full p-4 text-sm shadow-lg shadow-black">
              Until the other sender responds, your messages will only be available in this browser.
            </div>
          ) : null}
        </div>

        <form
          className="mt-full flex items-center justify-between space-x-4 border-t border-gray-800 p-5 pb-10"
          onSubmit={sendMessage}
        >
          {newMessageText.length < 100 ? (
            <input
              name="message"
              ref={newMessageInput as RefObject<HTMLInputElement>}
              disabled={messageTransactionInProgress ?? !recipient?.address}
              className="w-full resize-none rounded-lg  bg-gray-900 px-4 py-2 text-white ring-1  ring-gray-800  focus:ring-white disabled:bg-gray-800 "
              placeholder={'Message ' + shortenAddress(recipient?.address ?? '') + '...'}
              value={newMessageText}
              autoFocus={true}
              onChange={(e) => setNewMessageText(e.target.value)}
            />
          ) : (
            <textarea
              name="message"
              ref={newMessageInput as RefObject<HTMLTextAreaElement>}
              disabled={messageTransactionInProgress || !recipient?.address}
              className="w-full resize-none rounded-lg  bg-gray-900 px-4 py-2 text-white ring-1  ring-gray-800  focus:ring-white"
              value={newMessageText}
              autoFocus={true}
              onChange={(e) => setNewMessageText(e.target.value)}
              onFocus={function (e) {
                // used to keep focus when the input changes to a text area
                var val = e.target.value;
                e.target.value = '';
                e.target.value = val;
              }}
            />
          )}

          <div className="top-2 right-2">
            <Button5 loading={messageTransactionInProgress} v="secondary" type="submit">
              Send
            </Button5>
          </div>
        </form>
      </div>
    </div>
  );
}

function Contact(props: { selected: boolean; onSelect?: () => void; user: User }): JSX.Element {
  return (
    <div
      id={props.user.address}
      className={clsx(
        ' flex cursor-pointer items-center space-x-2 rounded-md px-2 py-2',
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

const ONE_WEEK_IN_MS = 7 * 24 * 3600 * 1000;

function MessageBlock(props: { myPubkey: string; messageBlock: MessageAccount[] }): JSX.Element {
  const sender = props.messageBlock[0].sender.toBase58();
  const iAmSender = sender === props.myPubkey;
  const msgIsForMe = !iAmSender;

  const ts = props.messageBlock[0].data.ts;
  const moreThanAWeekAgo = ts && Date.now() - ts.getTime() > ONE_WEEK_IN_MS;
  const timestamp = ts
    ? DateTime.fromJSDate(ts).toFormat(
        moreThanAWeekAgo
          ? 'ff' // Jun 9, 2022, 6:19 PM
          : 'cccc t' // "Friday 3:03 PM"
      )
    : null;

  const [firstMsg, ...rest] = props.messageBlock;
  const msgBaseClasses = clsx(
    'px-6 py-4 max-w-prose rounded-[40px] ',
    msgIsForMe ? 'bg-gray-800 text-white ml-4' : ' text-black mr-4',
    iAmSender && 'bg-colorful-gradient bg-repeat-round '
  );

  const lastMsgIndex = rest.length - 1;

  return (
    <div className={clsx('flex items-end ', iAmSender ? 'flex-row-reverse' : '')}>
      <ProfilePFP user={{ address: sender }} />
      <div
        className={clsx(
          'flex flex-col  space-y-2   text-white opacity-90',
          msgIsForMe ? 'items-start' : 'items-end '
        )}
      >
        {ts && <div className="ml-6 text-xs text-gray-300">{timestamp}</div>}
        <div
          className={clsx(
            msgBaseClasses,

            msgIsForMe ? 'rounded-bl-none' : 'rounded-br-none'
          )}
        >
          {firstMsg.data.body}
        </div>
        {rest.map((msg, i) => (
          <div
            key={msg.messageId + msg.data.body}
            className={clsx(
              msgBaseClasses,
              i !== lastMsgIndex ? (msgIsForMe ? 'rounded-l-none' : 'rounded-r-none') : null,
              i === lastMsgIndex ? (msgIsForMe ? 'rounded-tl-none' : 'rounded-tr-none') : null
            )}
          >
            {msg.data.body}
          </div>
        ))}
      </div>
    </div>
  );
}
