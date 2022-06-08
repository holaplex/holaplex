import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Button5 } from './Button2';
import { FailureToast } from './FailureToast';
import { SuccessToast } from './SuccessToast';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { useConnection } from '@solana/wallet-adapter-react';
import React, { FC, useState, useEffect, useMemo } from 'react';
import Button from '@/components/elements/Button';
import * as web3 from '@solana/web3.js';
import { Mailbox, MessageAccount } from '@usedispatch/client';
import { ProfilePFP } from '@/common/components/feed/FeedCard';

interface ProfileMessagesInterface {
  publicKey: string;
  mailbox: Mailbox | undefined;
  messages: Map<any, any>;
  mailboxAddress: web3.PublicKey | null;
  receiver?: any;
  uniqueSenders: string[];
}

export const ProfileMessages = ({ publicKey, ...props }: ProfileMessagesInterface) => {
  const [tx, setTx] = useState<string>('');
  const [receiver, setReceiver] = useState<string>(props.receiver ?? '');
  const { mailbox, messages, uniqueSenders, mailboxAddress } = props;
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  // console.log(mailbox, messages, mailboxAddress);

  const sendMessage = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      receiver: { value: string };
      message: { value: string };
    };
    if (!mailbox) {
      alert('wallet is not connected, not sending message');
      return;
    }
    const receiverPublicKey: web3.PublicKey = new web3.PublicKey(selectedMessage);
    const senderPublicKey = mailbox.mailboxOwner;
    const senderMailbox = mailbox;

    // TODO: can add a subject here via a new form element
    mailbox
      .sendMessage('No subject', target.message.value, receiverPublicKey!)
      .then((tx: any) => {
        setTx(tx);
        // TODO: message sent succesfully dialog
        // clear the message box
        target.receiver.value = props.receiver ?? '';
        target.message.value = '';
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

  return (
    <div className="container">
      <div className="flex">
        <div className="relative border-r border-gray-800">
          <div
            className={
              'fixed top-0 right-0 bottom-0 left-0 z-10 h-screen flex-none flex-row space-y-2 overflow-auto bg-gray-900 sm:sticky sm:mr-8  sm:block sm:w-64'
            }
          >
            <div className="grid-flow-col gap-4">
              <div className={'mx-2 my-4 rounded-md px-2 py-2 '}>
                <form>
                  <input
                    type="text"
                    name="newMessageReceipient"
                    className="z-0 h-14 w-full rounded-lg border border-gray-600 bg-[#161616] pl-10 pr-20 text-white"
                    placeholder="To..."
                  />
                </form>
              </div>
              {uniqueSenders.map((us: any) => {
                let cx = '';
                if (us == selectedMessage) {
                  cx = 'bg-gray-600';
                }
                return (
                  <div
                    className={'mx-2 my-4 rounded-md px-2 py-2 ' + cx}
                    onClick={() => {
                      setSelectedMessage(us);
                      setReceiver(us);
                    }}
                  >
                    <span className="inline-block">
                      <ProfilePFP user={{ address: us }} />
                    </span>
                    <span className="inline-block pl-2">{showFirstAndLastFour(us)}</span>
                  </div>
                );
              })}
              <span className="absolute bottom-10 left-4 ml-8 text-center">
                <Button secondary={true}>New message</Button>
              </span>
            </div>
          </div>
        </div>
        <div className="grow">
          <div className="relative h-full grid-flow-col gap-4">
            {
              //@ts-ignore
              selectedMessage != '' && messages[selectedMessage] ? (
                //@ts-ignore
                messages[selectedMessage].map((message: any, index) => {
                  let cx,
                    dx = '';
                  if (message.sender.toBase58() == publicKey) {
                    cx = 'text-right';
                    dx = 'float-right';
                  } else {
                    cx = 'text-left';
                    dx = 'float-left';
                  }

                  var nextSame = '  ';

                  if (
                    //@ts-ignore
                    messages[selectedMessage].length < index + 1 &&
                    message.sender.toBase58() ==
                      //@ts-ignore
                      messages[selectedMessage][index + 1].sender.toBase58()
                  ) {
                    nextSame = ' hidden ';
                  }

                  return (
                    <div className={'ml-4 py-2 ' + cx}>
                      <div
                        className={
                          'h12 false inline-flex max-h-12  w-[33%] items-center justify-center whitespace-nowrap rounded-xl border-[3px] border-transparent border-opacity-10 bg-gray-800 px-10 py-10 text-white opacity-90 transition-all hover:opacity-100 focus:border-[#72a4e1aa] active:scale-[0.99] '
                        }
                      >
                        <span>
                          {message.data.body}
                          <br />
                          {String(message.data.ts.toDateString())}
                        </span>
                      </div>
                      <div className={'inline-block ' + dx + nextSame}>
                        <ProfilePFP user={{ address: message.sender.toBase58() }} />
                      </div>
                    </div>
                  );
                })
              ) : (
                <></>
              )
            }
            <span className="absolute bottom-10 ml-8 w-full">
              <form onSubmit={sendMessage}>
                <div className="relative">
                  <input
                    type="text"
                    name="message"
                    className="z-0 h-14 w-full rounded-lg border border-gray-600 bg-[#161616] pl-10 pr-20 text-white"
                    placeholder="Message..."
                  />
                  <div className="absolute top-2 right-2">
                    <button
                      className="h-10 w-20 rounded-lg bg-white text-black hover:bg-gray-600"
                      type="submit"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </form>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
