import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import { EXECUTE, READ, WRITE } from "../../constants/rights.constants.js";

export type RightsFromIntegerError = AppValidationError;

const rightsFromMode = (
  integer: number,
): [string, undefined] | [undefined, RightsFromIntegerError] => {
  if (integer < 1 || integer > 7)
    return [
      undefined,
      new AppValidationError(
        `Rights (e.g. r, w, rw, rwx) can only be represented by an integer ranging from 1 to 7.`,
      ),
    ];

  const bits = integer
    .toString(2)
    .split("")
    .map((b) => +b);

  let rights: string = "";

  for (const [index, bit] of bits.entries()) {
    if (index === 0 && bit === 1) rights += READ;
    if (index === 1 && bit === 1) rights += WRITE;
    if (index === 2 && bit === 1) rights += EXECUTE;
  }

  return [rights, undefined];
};

export default rightsFromMode;
