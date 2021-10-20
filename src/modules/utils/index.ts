import { Fields, Files } from 'formidable';

/** Helper for formidable. */
export interface FormData {
  fields: Fields;
  files: Files;
}

/** Helper for nonlocal control flow for REST errors. */
export class ApiError extends Error {
  public readonly json: Readonly<object>;

  constructor(public readonly status: number, message: string | Record<string, any>) {
    super(typeof message === 'string' ? message : JSON.stringify(message));
    this.json = typeof message === 'string' ? { message } : message;
  }
}
