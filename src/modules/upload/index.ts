import type { NextApiRequest } from 'next'
import formidable from 'formidable'

export function parse(req: NextApiRequest): Promise<formidable.Files> {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, _, files) => {
      if (err) {
        reject(err)
        return
      }
      
      resolve(files)
    })
  })
}
