export type Err = Error | string;
export type Result<T> = { ok: T; err?: never } | { ok?: never; err: Err };

export const resultThen = <T, U>(res: Result<T>, then: (t: T) => Result<U>): Result<U> => {
  if (res.err === undefined) return then(res.ok);

  return res;
};

export const resultThenAsync = async <T, U>(
  res: Result<T>,
  then: (t: T) => PromiseLike<Result<U>>
): Promise<Result<U>> => {
  if (res.err === undefined) return await then(res.ok);

  return res;
};
