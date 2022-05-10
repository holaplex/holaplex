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
import * as web3 from "@solana/web3.js";

export const ProfileMessages = ({ publicKey, ...props}) => {
  const [tx, setTx] = useState<string>("");
  const [receiver, setReceiver] = useState<string>(props.receiver ?? "");
  const {mailbox, messages, mailboxAddress} = props;
  console.log(mailbox, messages, mailboxAddress);

  const handleReceiverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.receiver) {
      setReceiver(props.receiver);
    } else {
      setReceiver(e.target.value);
    }
  };

  const sendMessage = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      receiver: {value:string};
      message: {value:string};
    };
    if (!mailbox) {
      alert('wallet is not connected, not sending message');
    }
    const receiverPublicKey: web3.PublicKey = new web3.PublicKey(
      target.receiver.value
    );
    const senderPublicKey = mailbox.mailboxOwner;
    const senderMailbox = mailbox;

    // TODO: can add a subject here via a new form element
    mailbox
      .sendMessage("No subject", target.message.value, receiverPublicKey!)
      .then((tx) => {
        setTx(tx);
        // TODO: message sent succesfully dialog
        // clear the message box
        target.receiver.value = props.receiver ?? "";
        target.message.value = "";
      })
      .catch((error) => {
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
  }


  return (
    <>

      <h1>Compose</h1>

      <form onSubmit={sendMessage}>
        <div className="form-control w-full max-w-md">
          <label className="input-group input-group-sm min-width-7xl disabled: min-width-7xl disabled:bg-white disabled:text-black disabled:ml-0 disabled:mt-0 disabled:pl-0">
            <span className="px-1 text-sm font-medium">
              To:
            </span>
            <input
              type="text"
              placeholder="Public key"
              className="input input-bordered input-sm w-full mt-1 border-gray-300 disabled:border-none disabled:ml-0 disabled:mt-0 disabled:pl-0 disabled:cursor-text disabled:text-sm disabled:font-medium placeholder-gray-400"
              name="receiver"
              value={receiver}
              required
              onChange={handleReceiverChange}
            />
          </label>
        </div>
        <div className="form-control ">
          <label className="label">
            <span className="label-text font-medium">
              Message:
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered h-24 w-full  border-gray-300 text-black"
            placeholder="Message"
            name="message"
          />
        </div>
        <div className="flex justify-end pt-8">
          <button
            className="btn btn-primary bg-gray-800 text-white hover:bg-gray-700 hover:text-white "
            type="submit"
          >
            {"Send message"}
          </button>
        </div>
      </form>

      <h1>Messages go here</h1>
      <h2>ADDRESS: {mailboxAddress?.toBase58() ?? ""}</h2>
      {messages.map((message) => {
        return (
          <div>
            From:{message.sender.toBase58()}<br/>
          Subj: {message.data.subj}<br/>
          Body: {message.data.body}<br/>
          TS: {message.data.ts?.toDateString()}<br/>
          <div>
            <br/>
          </div>
          </div>
        );
      })}
    </>)
}
