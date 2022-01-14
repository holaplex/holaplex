import { ArweaveFile } from '@/modules/arweave/types';
import { ArweaveUploadPayload } from '@/modules/arweave/upload';
import { SignMetaParams } from '@/modules/storefront/approve-nft';
import { Storefront } from '@/modules/storefront/types';
import { JsonString } from '@/modules/utils/json';
import Ajv, { JTDParser, JTDSchemaType, ValidateFunction } from 'ajv/dist/jtd';
import getConfig from 'next/config';
import { NotarizedStr, SignatureStr } from '../notary/common';

// Tagged type hack
declare const schema: unique symbol;
export type Schema<T> = Symbol & { readonly [schema]: T };

export const Schema = Symbol as unknown as <T>(id: string) => Schema<T>;

export const SCHEMAS = {
  arweaveFile: Schema<ArweaveFile>('ArweaveFile'),
  arweaveUploadPayload: Schema<ArweaveUploadPayload>('ArweaveUploadPayload'),
  notarized: Schema<NotarizedStr<unknown>>('NotarizedStr<T>'),
  signMetaParams: Schema<SignMetaParams>('SignMetaParams'),
  storefront: Schema<Storefront>('Storefront'),
};

class SchemaManager {
  private ajv: Ajv = new Ajv();
  private schemas: Map<Schema<unknown>, JTDSchemaType<unknown>> = new Map();
  private validators: Map<Schema<unknown>, ValidateFunction<unknown>> = new Map();
  private parsers: Map<Schema<unknown>, JTDParser<unknown>> = new Map();

  public addSchema<T>(key: Schema<T>, schema: JTDSchemaType<T>) {
    if (this.schemas.has(key)) return;
    this.schemas.set(key, schema);
  }

  public schema<T>(key: Schema<T>): JTDSchemaType<T> {
    const schema = this.schemas.get(key);
    if (schema === undefined) throw new Error(`No schema found for ${key.description}!`);

    return schema as JTDSchemaType<T>;
  }

  public validator<T>(key: Schema<T>): ValidateFunction<T> {
    {
      const validator = this.validators.get(key);
      if (validator !== undefined) return validator as ValidateFunction<T>;
    }

    const validator = this.ajv.compile(this.schema(key));
    this.validators.set(key, validator);

    return validator;
  }

  public parser<T>(key: Schema<T>): JTDParser<T> {
    {
      const parser = this.parsers.get(key);
      if (parser !== undefined) return parser as JTDParser<T>;
    }

    const parser = this.ajv.compileParser(this.schema(key));
    this.parsers.set(key, parser);

    return parser;
  }
}

const addDefaultBuilders = (schemas: SchemaManager): SchemaManager => {
  const arweaveFile: JTDSchemaType<ArweaveFile> = {
    properties: {
      name: { type: 'string' },
      type: { type: 'string' },
      url: { type: 'string' },
    },
    additionalProperties: true,
  };

  schemas.addSchema(SCHEMAS.arweaveFile, arweaveFile);

  schemas.addSchema(SCHEMAS.arweaveUploadPayload, {
    properties: {
      fileHash: { type: 'string' },
      pubkey: { type: 'string' },
    },
  });

  // payload and signature use tagged type hacks, so this is okay
  schemas.addSchema(SCHEMAS.notarized, {
    properties: {
      payload: { type: 'string' } as unknown as JTDSchemaType<JsonString<unknown>>,
      signature: { type: 'string' } as unknown as JTDSchemaType<SignatureStr>,
    },
  });

  schemas.addSchema(SCHEMAS.signMetaParams, {
    properties: {
      metaProgramId: { type: 'string' },
      metadata: { type: 'string' },
      solanaEndpoint: { type: 'string' },
    },
  });

  schemas.addSchema(SCHEMAS.storefront, {
    properties: {
      meta: {
        properties: {
          title: { type: 'string' },
          description: { type: 'string' },
          favicon: arweaveFile,
        },
      },
      pubkey: { type: 'string' },
      subdomain: { type: 'string' },
      theme: {
        properties: {
          backgroundColor: { type: 'string' },
          logo: arweaveFile,
          primaryColor: { type: 'string' },
          textFont: { type: 'string' },
          titleFont: { type: 'string' },
        },
        optionalProperties: {
          banner: arweaveFile,
        },
      },
      integrations: {
        properties: {
          crossmintClientId: { type: 'string' },
        },
      },
    },
  });

  return schemas;
};

export const getJsonSchemas = (): SchemaManager => getConfig().serverRuntimeConfig.jsonSchemas;

const buildJsonSchemas = () => addDefaultBuilders(new SchemaManager());

export default buildJsonSchemas;
