/**
 * Given "SOME_RANDOM_LARGE_STRING" input, returns "SOME...RING";
 * Doesn't add ellipsis on smaller strings.
 */
export const showFirstAndLastFour = (str: string, isLowerThanEight = str.length <= 8) => {
  console.log({str});
  return isLowerThanEight ? str : `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;
};

/**
 * Pretty similar to Rust's b"Something" literal.
 * Useful for using with Solana's PDAs.
 * @returns An {Uint8Array} representation of the given string.
 */
export const b = (input: TemplateStringsArray) => new TextEncoder().encode(input.join(''));

/**
 * Similar to b but generates a native JS number array;
 * Not that there's anything wrong with a {Uint8Array}.
 * @returns A [number] of bytes (0-255).
 */
export const n = (input: TemplateStringsArray) => [...b(input)];
