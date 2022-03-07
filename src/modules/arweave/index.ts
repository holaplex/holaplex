import Arweave from 'arweave';

export const initArweave = () => {
  const arweave = Arweave.init({
    host: process.env.NEXT_PUBLIC_ARWEAVE_HOST,
    port: process.env.NEXT_PUBLIC_ARWEAVE_PORT,
    protocol: process.env.NEXT_PUBLIC_ARWEAVE_PROTOCOL,
    logging: true,
    timeout: 30 * 1000
  });

  return arweave;
};
