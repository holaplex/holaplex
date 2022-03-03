import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { makeSingletons } from '../utils/singleton';
import buildArweave from './arweave';
import buildJsonSchemas from './json-schemas';
import buildSolana from './../solana/buildSolana';

const singletons = makeSingletons({
  secrets: () => new SecretsManagerClient({ region: process.env.AWS_REGION }),
  arweave: buildArweave(process.env.ARWEAVE_SECRET_ID),
  jsonSchemas: buildJsonSchemas,
  solana: buildSolana(process.env.SOLANA_SECRET_ID),
});

export default singletons;
