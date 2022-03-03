import type { NextApiRequest, NextApiResponse } from 'next';

function initMiddleware(
  middleware: (req: NextApiRequest, res: NextApiResponse, callback: (result: any) => any) => void
): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
  return (req: NextApiRequest, res: NextApiResponse) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
