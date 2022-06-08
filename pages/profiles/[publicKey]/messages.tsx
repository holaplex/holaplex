import { GetServerSideProps, NextPage } from 'next';
import { ProfileMessages } from '@/common/components/elements/ProfileMessages';
import {
  getProfileServerSideProps,
  WalletDependantPageProps,
} from '@/modules/server-side/getProfile';
import { ProfileDataProvider } from '@/common/context/ProfileData';
import { ProfilePageHead } from '../[publicKey]';
import { useEffect, useState } from 'react';
import * as web3 from '@solana/web3.js';
import { useMailbox } from '@/common/context/MailboxProvider';

export const getServerSideProps: GetServerSideProps<WalletDependantPageProps> = async (context) =>
  getProfileServerSideProps(context);

const MessagesPage: NextPage<WalletDependantPageProps> = ({ publicKey, ...props }) => {
  const [messages, setMessages] = useState<Map<string, []>>(new Map());
  const [uniqueSenders, setUniqueSenders] = useState<string[]>([]);
  const [mailboxAddress, setMailboxAddress] = useState<web3.PublicKey | null>(null);

  const mailbox = useMailbox();

  useEffect(() => {
    // console.log('use effect');
    if (mailbox) {
      // console.log('mailbox!: ', mailbox);
      mailbox.getMailboxAddress().then((address) => setMailboxAddress(address));

      mailbox
        .fetchMessages()
        .then((messages) => {
          console.log('messages>', messages);

          const uniqueSenders = [
            ...new Set(messages.map((message: any) => message.sender.toBase58())),
          ];
          const pArray = uniqueSenders.map((u) =>
            mailbox.fetchSentMessagesTo(new web3.PublicKey(String(u)))
          );
          Promise.all(pArray).then((msgs) => {
            let allMessages = new Map();
            for (var i = 0; i < uniqueSenders.length; i++) {
              //@ts-ignore // we know they will be strings
              allMessages[uniqueSenders[i]] = [
                ...msgs[i],
                ...messages.filter(
                  (m: any) => m.receiver == publicKey && m.sender == uniqueSenders[i]
                ),
              ].sort((a, b) => {
                console.log('Comparing');
                console.log(new Date(String(a.data.ts)).getTime());
                console.log(new Date(String(b.data.ts)).getTime());
                if (new Date(String(a.data.ts)).getTime() > new Date(String(b.data.ts)).getTime()) {
                  console.log('sort true');
                  return -1;
                }

                if (new Date(String(a.data.ts)).getTime() < new Date(String(b.data.ts)).getTime()) {
                  console.log('sort false');
                  return -1;
                }

                return 0;
              });
            }
            console.log(allMessages);
            setMessages(allMessages);
            setUniqueSenders(uniqueSenders);
          });
        })
        .catch(() => {
          setMessages(new Map());
        });
    } else {
      console.log('no mailbox initiatlized');
    }
  }, [mailbox]);

  return (
    <ProfileDataProvider profileData={{ publicKey, ...props }}>
      <ProfilePageHead
        publicKey={publicKey}
        twitterProfile={{
          twitterHandle: props.twitterHandle,
          banner: props.banner,
          pfp: props.profilePicture,
        }}
        description="View activity for this, or any other pubkey, in the Holaplex ecosystem."
      />

      <ProfileMessages
        publicKey={publicKey}
        messages={messages}
        mailboxAddress={mailboxAddress}
        mailbox={mailbox}
        uniqueSenders={uniqueSenders}
      />
    </ProfileDataProvider>
  );
};
export default MessagesPage;
