export type SingletonBuilders<T extends SingletonBuilders<T>> = Record<
  string,
  (ctx: SingletonValues<T>) => any
>;
export type SingletonValues<T extends SingletonBuilders<T>> = { [K in keyof T]: ReturnType<T[K]> };

export const makeSingletons = <T extends SingletonBuilders<T>>(builders: T): SingletonValues<T> => {
  const ret: Partial<SingletonValues<T>> = {};

  for (const key of Object.keys(builders)) {
    const build = builders[key];
    let uninit = true;
    let value: any;

    Object.defineProperty(ret, key, {
      get() {
        if (uninit) {
          value = build(ret as SingletonValues<T>);
          uninit = false;
        }

        return value;
      },
    });
  }

  return ret as SingletonValues<T>;
};
