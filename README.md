# 👋 Welcome to Holaplex - Tools built by creators, for creators, owned by creators.

## Local project setup

First, install dependencies

```
yarn install
```

A local database must be booted within a docker container using
docker-compose. Run the following commands to start a database, load schema, and seed with demo storefront.

```
docker-compose up -d
yarn db:migrate
SOLANA_PUBKEY=${SOLANA_PUBKEY} yarn run db:seed
```

Run the db seed command to populate the database with your Solana wallet public key.

You might also want to setup a `.env.local` file with the following overrides:

```env
# mainnet
NEXT_PUBLIC_SOLANA_ENDPOINT="https://holaplex.rpcpool.com/"
# devnet (comment out when you want to use real solana)
NEXT_PUBLIC_SOLANA_ENDPOINT="http://api.devnet.solana.com"

NFT_STORAGE_API_KEY="" # got to https://nft.storage and create an account, and get an API key.

NEXT_PUBLIC_MIXPANEL_TOKEN
```

## Development

If you are developing the Storefront builder, make sure sure Docker is launched with the local database.

Then, simply run the development server:

```
PORT=3001 yarn dev
```

Replace 3001 with an available port on your machine for this and any of the following examples.

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.
