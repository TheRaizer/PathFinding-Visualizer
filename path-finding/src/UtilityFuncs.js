export const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const rnd = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
