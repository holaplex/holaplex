/**
 * NOTE: Don't use for cryptographic purposes.
 *
 * @param seed A number, can be the addition of the random bytes of a public key.
 * @returns An insecure, pseudoRandom number between 0 and 1.
 */
export const seededPseudoRandom = (seed: number) => {
  const rng = Math.sin(seed++) * 10000;
  return rng - Math.floor(rng);
};

/**
 * Generates a random between two numbers
 */
export const randomBetween = (min: number, max: number) => Math.floor(Math.random() * max) + min;

/**
 * Generates a seeded random between two numbers
 */
export const seededRandomBetween = (seed: number, min: number, max: number) =>
  Math.floor(seededPseudoRandom(seed) * max) + min;
