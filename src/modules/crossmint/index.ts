import axios from 'axios';

const baseUrl = `https://www.crossmint.io/api/v1-alpha1`;

const client = axios.create({ baseURL: baseUrl });

export const verifyTOS = async (wallet: string) => {
  const res = await client.get(`/tos/status?locator=sol:${wallet}`, {
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_CROSSMINT_API_KEY,
    },
  });
  return res;
};

export const acceptTOS = async (wallet: string) => {
  const res = await client.post(
    `/tos/accept/`,
    {
      locator: `sol:${wallet}`,
      marketplaceName: 'Holaplex',
    },
    {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_CROSSMINT_API_KEY,
        'Access-Control-Allow-Origin': '*',
      },
    }
  );

  return res;
};
