import { JTDParser, ValidateFunction } from 'ajv/dist/jtd';
import { Result } from './result';

// Tagged type hack
declare const jsonStr: unique symbol;
export type JsonString<T> = string & { readonly [jsonStr]: T };

export type Validator<T> = (val: any) => Result<T>;
export type Parser<T> = (str: JsonString<T>) => Result<T>;

export const jsonStringify = <T>(value: T): JsonString<T> => JSON.stringify(value) as JsonString<T>;

export const jsonParse =
  <T>(validate: Validator<T>): Parser<T> =>
  (string: JsonString<T>) => {
    const ret = JSON.parse(string);

    if (validate(ret)) return ret;

    return undefined;
  };

export const ajvValidate =
  <T>(validate: ValidateFunction<T>): Validator<T> =>
  (val: any) => {
    if (validate(val)) return { ok: val };

    return {
      err: validate.errors?.map((e) => e.message).join('; ') ?? 'Failed to validate object',
    };
  };

export const ajvParse =
  <T>(parse: JTDParser<T>): Parser<T> =>
  (val: string) => {
    const ok = parse(val);
    if (ok !== undefined) return { ok };

    return { err: parse.message ?? 'Failed to parse JSON string' };
  };
