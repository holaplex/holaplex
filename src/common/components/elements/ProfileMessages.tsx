import { useMakeConnection } from '@/common/hooks/useMakeConnection';
import { useRevokeConnection } from '@/common/hooks/useRevokeConnection';
import { IProfile } from '@/modules/feed/feed.interfaces';
import { useAnalytics } from '@/common/context/AnalyticsProvider';
import { showFirstAndLastFour } from '@/modules/utils/string';
import { AnchorWallet } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { FC, useState, useEffect } from 'react';
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
  messages: any;
  mailboxAddress: web3.PublicKey | null;
  receiver?: any;
}

export const ProfileMessages = ({ publicKey, ...props }: ProfileMessagesInterface) => {
  const [tx, setTx] = useState<string>('');
  const [receiver, setReceiver] = useState<string>(props.receiver ?? '');
  const { mailbox, messages, mailboxAddress } = props;
  const [selectedMessage, setSelectedMessage] = useState<string>('');
  // console.log(mailbox, messages, mailboxAddress);
  const [allMessages, setAllMessages] = useState<Map<string, []>>(new Map());

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.receiver) {
      setReceiver(props.receiver);
    } else {
      setReceiver(e.target.value);
    }
  };

  useEffect(() => {
    console.log('use effect profilemessages');
    if (mailbox && messages) {
      const uniqueSenders = [...new Set(messages.map((message: any) => message.sender.toBase58()))];
      const pArray = uniqueSenders.map(u =>
        mailbox.fetchSentMessagesTo(new web3.PublicKey(String(u)))
      );
      Promise.all(pArray).then(msgs => {
        console.log(msgs);
        // setSentMessages(msgs);

        let allMessages = new Map();
        for (var i = 0; i < uniqueSenders.length; i++) {
          console.log('Sent to: ', uniqueSenders[i]);
          console.log(msgs[i]);
          //@ts-ignore // we know they will be strings
          allMessages[uniqueSenders[i]] = [
            ...msgs[i],
            ...messages.filter((m: any) => m.receiver == publicKey && m.sender == uniqueSenders[i]),
          //@ts-ignore
          ].sort((a, b) => a.data.ts > b.data.ts);
        }
        console.log('all messages');
        console.log(allMessages);
        setAllMessages(allMessages);
      });
    }
  }, [mailbox]);

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

  const uniqueSenders = [...new Set(messages.map((message: any) => message.sender.toBase58()))];

  return (
    <>
      <div className='flex'>
        <div className='flex-initial mr-4 border-r border-white w-52'>
          <div className='grid-flow-col'>
            {uniqueSenders.map((us: any) => (
              <div
                className='px-2 py-2 mx-2 my-4 border border-white rounded-full'
                onClick={() => {
                  setSelectedMessage(us);
                  setReceiver(us);
                }}
              >
                <img
                  width='40'
                  height='40'
                  src='https://pbs.twimg.com/profile_images/1524044279664066562/CymWl0U4.jpg'
                  className='inline-block rounded-full shadow-lg shadow-black'
                  alt='Profile Image'
                />
                <span className='inline-block'>{showFirstAndLastFour(us)}</span>
              </div>
            ))}
          </div>
          <span>
            <p>Selected: {showFirstAndLastFour(selectedMessage)}</p>
          </span>
        </div>
        <div className='grow'>
          <div className='grid grid-flow-row'>
            {//@ts-ignore
            selectedMessage != '' && allMessages[selectedMessage] ? (
              //@ts-ignore
              allMessages[selectedMessage].map((message: any) => {
                let cx = '';
                if (message.sender.toBase58() == publicKey) {
                  cx = 'background-blue text-white';
                } else {
                  cx = 'background-black text-white border border-white';
                }

                return (
                  // <div>
                  //
                  //   <br />
                  //   Subj: {message.data.subj}
                  //   <br />
                  //   Body: {message.data.body}
                  //   <br />
                  //   TS: {message.data.ts?.toDateString()}
                  //   <br />
                  //   <div>
                  //     <br />
                  //   </div>
                  // </div>
                  <div className={'py-2 ' + cx}>
                    <span>From:{showFirstAndLastFour(message.sender.toBase58())}</span>
                    <br />
                    <span>To:{showFirstAndLastFour(message.receiver.toBase58())}</span>
                    <br />
                    <span>{String(message.data.ts)}</span>
                    <br />
                    <span>{message.data.body}</span>
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
          <form onSubmit={sendMessage} className='bottom-0'>
            <div className='relative'>
              <input
                type='text'
                name='message'
                className='z-0 w-full pl-10 pr-20 text-white bg-gray-800 rounded-lg h-14 focus:shadow focus:outline-none focus:border-0'
                placeholder='Search anything...'
              />
              <div className='absolute top-2 right-2'>
                <button
                  className='w-20 h-10 text-white bg-red-500 rounded-lg hover:bg-red-600'
                  type='submit'
                >
                  Send
                </button>
              </div>
            </div>
            {/* <div className='form-control '>
            <textarea
              className='w-full h-24 text-black border-gray-300 textarea textarea-bordered'
              placeholder='Message'
              name='message'
            />
          </div>
          <div className='flex justify-end pt-8'>
            <button
              className='text-white bg-gray-800 btn btn-primary hover:bg-gray-700 hover:text-white '
              
            >
              {'Send message'}
            </button>
          </div> */}
          </form>
        </div>
      </div>

      {/*       <div className='border border-white'>
        <h1>Compose</h1>

        <h1>Messages go here</h1>
        <h2>ADDRESS: {mailboxAddress?.toBase58() ?? ''}</h2>
      </div>
     */}
    </>
  );
};
