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
import { useTwitterHandle } from '@/common/hooks/useTwitterHandle';
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
    <div className='container'>
      <div className='flex'>
        <div className='relative border-r border-gray-800'>
          <div
            className={
              'fixed top-0 right-0 bottom-0 left-0 z-10 bg-gray-900 flex-row flex-none space-y-2 sm:sticky sm:block sm:w-64 sm:mr-8  overflow-auto h-screen'
            }
          >
            <div className='grid-flow-col gap-4'>
              <div className={'px-2 py-2 mx-2 my-4 rounded-md '}>
                <form>
                  <input
                    type='text'
                    name='newMessageReceipient'
                    className='z-0 w-full pl-10 pr-20 text-white bg-[#161616] border border-gray-600 rounded-lg h-14'
                    placeholder='To...'
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
                    className={'px-2 py-2 mx-2 my-4 rounded-md ' + cx}
                    onClick={() => {
                      setSelectedMessage(us);
                      setReceiver(us);
                    }}
                  >
                    <span className='inline-block'>
                      <ProfilePFP user={{ address: us }} />
                    </span>
                    <span className='inline-block pl-2'>{showFirstAndLastFour(us)}</span>
                  </div>
                );
              })}
              <span className='absolute ml-8 text-center bottom-10 left-4'>
                <Button secondary={true}>New message</Button>
              </span>
            </div>
          </div>
        </div>
        <div className='grow'>
          <div className='relative h-full grid-flow-col gap-4'>
            {//@ts-ignore
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
                  <div className={'py-2 ml-4 ' + cx}>
                    <div
                      className={
                        'h12 max-h-12 px-10 py-10  text-white inline-flex focus:border-[#72a4e1aa] active:scale-[0.99] hover:opacity-100 items-center justify-center border-[3px] border-transparent opacity-90 transition-all bg-gray-800 false whitespace-nowrap border-opacity-10 rounded-xl w-[33%] '
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
            )}
            <span className='absolute w-full ml-8 bottom-10'>
              <form onSubmit={sendMessage}>
                <div className='relative'>
                  <input
                    type='text'
                    name='message'
                    className='z-0 w-full pl-10 pr-20 text-white bg-[#161616] border border-gray-600 rounded-lg h-14'
                    placeholder='Message...'
                  />
                  <div className='absolute top-2 right-2'>
                    <button
                      className='w-20 h-10 text-black bg-white rounded-lg hover:bg-gray-600'
                      type='submit'
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
