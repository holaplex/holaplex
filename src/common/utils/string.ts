export const b = (input: TemplateStringsArray) => new TextEncoder().encode(input.join(''));

export const n = (input: TemplateStringsArray) => [...b(input)];
