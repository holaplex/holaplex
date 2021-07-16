
import { createServer } from 'http'
import { parse } from 'url'
import fs from 'fs'
import next from 'next'

const port = 3000
const production = process.env.NODE_ENV === 'production'
const dev = !production
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(port)

  if (production) {
    fs.writeFileSync("/tmp/app-initialized", "")
  }

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})