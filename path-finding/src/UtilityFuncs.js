export const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

export const rnd = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const rndEven = (min, max) => {
  let randomNum = Math.floor(rnd(min, max) / 2) * 2;
  return randomNum;
};

export const rndOdd = (min, max) => {
  max = max % 2 === 0 ? max : max - 1;
  let randomNum = Math.floor(rnd(min, max) / 2) * 2 + 1;
  return randomNum;
};
