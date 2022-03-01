export const MediaQuerySizes = { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 } as const;
export const mq = (key: keyof typeof MediaQuerySizes) => `@media (min-width: ${MediaQuerySizes[key]}px)`;
