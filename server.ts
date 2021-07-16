
import { createServer } from 'http'
import { parse } from 'url'
import fs from 'fs'
import next from 'next'

let port = process.env.PORT || '3000'
const production = process.env.NODE_ENV === 'production'
const dev = !production
const app = next({ dev })
const handle = app.getRequestHandler()

if(production) {
  port = fs.readFileSync("/tmp/nginx.socket", { encoding:'utf8', flag:'r' })
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    handle(req, res, parsedUrl)
  }).listen(parseInt(port, 10))

  if (production) {
    fs.writeFileSync("/tmp/app-intiliazed", "")
  }

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})