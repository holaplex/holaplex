export const showFirstAndLastFour = (str: string, isLowerThanEight = str.length <= 8) =>
  isLowerThanEight ? str : `${str.substring(0, 4)}...${str.substring(str.length - 4)}`;