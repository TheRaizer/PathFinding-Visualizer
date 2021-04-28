export const timer = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getKeyByValue = (object, value) => {
  return Object.keys(object).find((key) => object[key] === value);
};

/* Returns a random number within a range.

  @param {number} min - minimum random number (inclusive)
  @param {number} max - maximum random number (inclusive)
*/
export const rnd = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/* Returns a random even number within a range of 2 even numbers.

  @param {number} min - minimum EVEN random number (inclusive)
  @param {number} max - maximum EVEN random number (inclusive)
*/
export const rndEven = (min, max) => {
  let randomNum = Math.floor(rnd(min, max) / 2) * 2;
  return randomNum;
};

/* Returns a random odd number between a range of 2 odd numbers.

  @param {number} min - minimum ODD random number (inclusive)
  @param {number} max - maximum ODD random number (inclusive)
*/
export const rndOdd = (min, max) => {
  max = max % 2 === 0 ? max : max - 1;
  let randomNum = Math.floor(rnd(min, max) / 2) * 2 + 1;
  return randomNum;
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
