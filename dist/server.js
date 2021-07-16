"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const fs_1 = __importDefault(require("fs"));
const next_1 = __importDefault(require("next"));
let port = process.env.PORT || '3000';
const production = process.env.NODE_ENV === 'production';
const dev = !production;
const app = next_1.default({ dev });
const handle = app.getRequestHandler();
if (production) {
    port = fs_1.default.readFileSync("/tmp/nginx.socket", { encoding: 'utf8', flag: 'r' });
}
app.prepare().then(() => {
    http_1.createServer((req, res) => {
        const parsedUrl = url_1.parse(req.url, true);
        handle(req, res, parsedUrl);
    }).listen(parseInt(port, 10));
    if (production) {
        fs_1.default.writeFileSync("/tmp/app-intiliazed", ".ready");
    }
    // tslint:disable-next-line:no-console
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
});
