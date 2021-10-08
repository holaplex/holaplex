import type { NextApiRequest, NextApiResponse } from 'next'
import UploadFiles from '@/modules/ipfs/client'
import { IncomingForm } from 'formidable';
import { ApiError, FormData } from '@/modules/utils';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<object>
) {
  switch (req.method) {
    case 'POST': {
      const params = await new Promise<FormData>((ok, err) => {
        const form = new IncomingForm({ keepExtensions: true });

        form.parse(req, (formErr, fields, files) => {
          if (formErr) {
            console.error(formErr);
            const e = new ApiError(400, 'Malformed request body');
            err(e);
            throw e;
          }

          ok({ fields, files });
        });
      });
      const reuslts = await UploadFiles(params.files)

      return reuslts

    }

    default:
      res.setHeader('Allow', ['POST'])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
