import { Wallet } from '@/modules/wallet/types';

const find = async (pubkey: string): Promise<Wallet | null> => {
  const response = await fetch(`/api/wallets/${pubkey}`);

  if (!response.ok) {
    return null;
  }

  const json = await response.json();

  return json;
};

const create = async (pubkey: string): Promise<Wallet | null> => {
  try {
    const response = await fetch('/api/wallets', {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        pubkey,
      }),
    });

    const json = await response.json();

    return json;
  } catch (e) {
    throw e;
  }
};

const client = {
  find,
  create,
};

export default client;
