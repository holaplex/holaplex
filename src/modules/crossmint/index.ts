import axios from 'axios';

const baseUrl = `https://crossmint.io/api/v1-alpha1`;

const client = axios.create({ baseURL: baseUrl });

export const verifyTOS = async () => {
  const res = await client.get(
    `/tos/status?locator=sol:9Gwy8sWsVoMomwmCumZGjLjtEbJ4hNC2rEYgjyJHvZA2`,
    {
      headers: {
        'x-api-key': 'API KEY',
      },
    }
  );
  return res;
};

export const acceptTOS = async () => {
  const res = await client.post(`/tos/accept`, {
    headers: {
      'x-api-key': 'API KEY',
    },
  });

  return res;
};
