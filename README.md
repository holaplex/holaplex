# 👋 Welcome to Holaplex - Tools built by creators, for creators, owned by creators.

## Local project setup

First, install dependencies

```
yarn install
```

A local database must be booted within a docker container using
docker-compose. Run the following commands to start a database, load schema.

```
docker-compose up -d
yarn db:migrate
```

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

## Graph QL Queries

We expose a Graph QL layer for data produced by the indexer.

### View Available Data

View available data at https://docs.holaplex.com/

### View and Use Existing Queries

Query code is generated from Graph QL queries.
The query specs are located in [./src/graphql/\*_/_.graphql](./src/graphql/).
These specs are processed by the `generate:graphql` script in [package.json](./package.json).
The script outputs typescript types and react hooks with documentation that can be used to fetch data from
the Graph QL layer. See [indexerTypes.ts](./src/graphql/indexerTypes.ts) for existing queries.

To use a query, use its hook as documented in the query example for the query in [indexerTypes.ts](./src/graphql/indexerTypes.ts).

### Add a Query

To add a query, you need to define the Graph QL query spec and use it to generate the necessary
types and hook. To do this

1. Build the query from available data (see above).
1. Save the query as a new `.graphql` file in the specs location (see above).
1. Generate the code with `yarn generate:graphql`. This produces code in [indexerTypes.ts](./src/graphql/indexerTypes.ts).
1. Finally, use the generated hook in your react component.
