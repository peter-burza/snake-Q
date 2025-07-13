//---- GLOBAL FUNCTIONS ----//

export function getRndNum(min, max) {
  let rndNum = Math.floor(Math.random() * (max - min)) + min;
  return rndNum;
};