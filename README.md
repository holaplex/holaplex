This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

A local database can be booted within a docker container using
docker-compose. Run the
following commands to start a database, load schema, and seed with demo
storefront.

```
docker-compose up -d
yarn db:schema:push
yarn db:seed
```

A local instance of arweave can be booted with the following command. It will bind to port 1984. A graphiql explore is available at [http://localhost:1984/graphiql](http://localhost:1984/graphiql).

```
npx @textury/arlocal
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

