This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
PORT=3001 yarn dev
```

Replace 3001 with an available port on your machine for this and any of the following examples.

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3001/api/hello](http://localhost:3001/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

A local database can be booted within a docker container using
docker-compose. Run the
following commands to start a database, load schema, and seed with demo
storefront.

```
docker-compose up -d
yarn db:migrate
yarn db:seed
```

A local instance of Arweave can be booted with the following command. It will bind to port 1984. A GraphQL explore is available at [http://localhost:1984/graphql](http://localhost:1984/graphql).

```
npx @textury/arlocal
```

To configure the server to use `arlocal`, add the following to `.env.local`:

```env
NEXT_PUBLIC_ARWEAVE_HOST=localhost
NEXT_PUBLIC_ARWEAVE_PORT=1984
NEXT_PUBLIC_ARWEAVE_PROTOCOL=http
# mainnet
NEXT_PUBLIC_SOLANA_ENDPOINT="https://holaplex.rpcpool.com/"
# devnet (comment out when you want to use real solana)
NEXT_PUBLIC_SOLANA_ENDPOINT="http://api.devnet.solana.com"

NFT_STORAGE_API_KEY="" # got to https://nft.storage and create an account, and get an API key.
```

Run the db seed command to populate the database with your Solana wallet
public key.

```
SOLANA_PUBKEY=${SOLANA_PUBKEY} yarn run db:seed
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
