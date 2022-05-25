import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { FC, useState, useEffect, useMemo } from 'react';
import { useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { Button5 } from './Button2';
import { FailureToast } from './FailureToast';
import { SuccessToast } from './SuccessToast';
import * as web3 from '@solana/web3.js';
import { Mailbox, MessageAccount } from '@usedispatch/client';

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


  useEffect(()=>{
    if (uniqueSenders.length > 0){
      // FETCH PROFILE INFO HERE
    }
  }, [uniqueSenders])
  
  return (
    <div className="container h-[85%]">
      <div className='flex h-[85%]'>
        <div className='flex-initial mr-4 border-r border-gray-600 w-72'>
          <div className='grid-flow-col'>
            {uniqueSenders.map((us: any) => {
              
              let cx = ""
              if (us == selectedMessage){
                cx = "bg-gray-600"
              }
              
              return (
              <div
                className={'px-2 py-2 mx-2 my-4 rounded-md ' + cx}
                onClick={() => {
                  setSelectedMessage(us);
                  setReceiver(us);
                }}
              >
                <img
                  width='40'
                  height='40'
                  src='https://pbs.twimg.com/profile_images/1529154555874795520/8lf1n7OZ_400x400.jpg'
                  className='inline-block rounded-full shadow-lg shadow-black'
                  alt='Profile Image'
                />
                <span className='inline-block pl-2'>{showFirstAndLastFour(us)}</span>
              </div>
            )})}
          </div>
          <div className='text-center'>
            <button className='w-20 text-white bg-gray-500 rounded-lg h-17 hover:bg-gray-600'>New message</button>
          </div>
        </div>
        <div className='mr-10 grow'>
          <div className='grid grid-flow-row h-[80%]'>
            {//@ts-ignore
            selectedMessage != '' && messages[selectedMessage] ? (
              //@ts-ignore
              messages[selectedMessage].map((message: any) => {
                let cx, dx= '';
                if (message.sender.toBase58() == publicKey) {
                  cx = 'text-right';
                  dx = 'float-right'
                } else {
                  cx = 'text-left';
                }

                return (
                  <div className={'py-2 ' + cx }>
                    <div className={'bg-gray-600 rounded-xl w-[33%] ' + dx}>
                      <span>
                        {message.data.body}
                        <br />
                        {String(message.data.ts.toDateString())}
                    </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <form onSubmit={sendMessage} className='relative bottom-0 '>
            <div className='relative'>
              <input
                type='text'
                name='message'
                className='z-0 w-full pl-10 pr-20 text-white bg-gray-800 rounded-lg h-14 focus:shadow focus:outline-none focus:border-0'
                placeholder=''
              />
              <div className='absolute top-2 right-2'>
                <button
                  className='w-20 h-10 text-white bg-gray-500 rounded-lg hover:bg-gray-600'
                  type='submit'
                >
                  Send
                </button>
              </div>
            </div>
           
          </form>
        </div>
      </div>
    </div>
  );
};
