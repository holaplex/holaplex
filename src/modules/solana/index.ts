import { Solana } from './types';

export const connectSolana = async (solana: Solana): Promise<void> => {
  if (!solana.isConnected) {
    await Promise.all([new Promise<void>((ok) => solana.once('connect', ok)), solana.connect()]);
  }
};
