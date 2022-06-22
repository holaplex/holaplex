import { createContext, useContext, useState, useEffect } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
//@ts-ignore
import { Mailbox } from '@usedispatch/client';
import { useConnection } from '@solana/wallet-adapter-react';

const MailboxContext = createContext<Mailbox | undefined>(undefined);

type MailboxProviderProps = {
  children: React.ReactNode;
}

export const MailboxProvider = (props: MailboxProviderProps): JSX.Element => {

  const wallet = useWallet();

  const { connection } = useConnection();
  const [mailbox, setMailbox] = useState<Mailbox>();
  const cluster = 'mainnet-beta';

  useEffect(() => {
    if (!wallet.publicKey) {
      return;
    }
    const mb = new Mailbox(connection, wallet, { cluster , sendObfuscated: true});
    setMailbox(mb);
  }, [connection, wallet.publicKey, cluster]);

  return (
    <MailboxContext.Provider value={mailbox}>
      {props.children}
    </MailboxContext.Provider>
  );
}

export const useMailbox = () => useContext(MailboxContext);
