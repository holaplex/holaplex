export type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

// Examples:
// type T0 = Unpacked<string>; // string
// type T1 = Unpacked<string[]>; // string
// type T2 = Unpacked<() => string>; // string
// type T3 = Unpacked<Promise<string>>; // string
// type T4 = Unpacked<Promise<string>[]>; // Promise<string>
// type T5 = Unpacked<Unpacked<Promise<string>[]>>; // string
