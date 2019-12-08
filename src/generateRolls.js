import cartesian from 'big-cartesian';

export function generateRolls(sides, numberOfDices) {
  const cache = new Map();
  const result = cache.get(`${sides}-${numberOfDices}`);
  if (result) {
    return result;
  } else {
    cache.set(`${sides}-${numberOfDices}`, [
      ...cartesian(Array.from({ length: numberOfDices }, () => Array.from({ length: sides }, (x, i) => i + 1)))
    ]);
    return cache.get(`${sides}-${numberOfDices}`);
  }
}
