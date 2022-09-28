/* eslint-disable prettier/prettier */

/**
 * Convert string to array
 * Find and store the indexes of the last 6 digits
 * iterate through and check if the first and last are 0s
 * If any of them is 0, replace it with a random number between 1-9
 * */

// check if an item is a number.
function isNumber(item) {
  if (isNaN(item)) {
    return false;
  }
  return true;
}

// function to shuffle a string
function shuffle(str) {
  const a = str.split("");
  const n = a.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a.join("");
}

// generate random number between 1-9
function getValidNumber() {
  return Math.floor(Math.random() * 8 + 1);
}

// gets index of the last six integers in a string
function getIndexOfLastSixIntegers(str) {
  const tokenizedString = str;
  const lengthOfArray = tokenizedString.length;
  const arrayOfIndexes = [];

  for (let i = lengthOfArray - 1; i >= 0; i--) {
    const convertedNumber = parseInt(tokenizedString[i]);
    if (isNumber(convertedNumber)) {
      arrayOfIndexes.push(i);
      tokenizedString[i] = convertedNumber;
    }
    if (arrayOfIndexes.length === 6) break;
  }

  return arrayOfIndexes;
}

// converts any instance of 0 at the start and end of the last six integers to a random value between 1-9
function processFirstAndLastDigits(tokenizedString, indexesOfLastSixIntegers) {
  const indexOfLastDigit = indexesOfLastSixIntegers[0];
  const indexOfFirstDigit = indexesOfLastSixIntegers[5];

  if (tokenizedString[indexOfFirstDigit] === 0)
    tokenizedString[indexOfFirstDigit] = getValidNumber();
  if (tokenizedString[indexOfLastDigit] === 0)
    tokenizedString[indexOfLastDigit] = getValidNumber();

  return tokenizedString;
}

// executes the flow process
export default function transformer(data) {
  const randomness = shuffle(data.randomness);
  const tokenizedString = randomness.split("");
  const indexesOfLastSixIntegers = getIndexOfLastSixIntegers(tokenizedString);
  const correctedArrayOfStrings = processFirstAndLastDigits(
    tokenizedString,
    indexesOfLastSixIntegers
  );
  const correctedString = correctedArrayOfStrings.join("");

  return correctedString;
}
