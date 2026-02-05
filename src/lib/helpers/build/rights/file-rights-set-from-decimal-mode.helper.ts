import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import { EXECUTE, READ, WRITE } from "../../../constants/rights/rights.constants.js";
import type { FileRightsSet } from "../../../interfaces/file-rights-set.interface.js";

export type FileRightsFromDecimalError = AppValidationError;

const fileRightsSetFromDecimalMode = (
  decimal: number,
): [FileRightsSet, undefined] | [undefined, FileRightsFromDecimalError] => {
  const rights: FileRightsSet = {
    user: "",
    group: "",
    other: "",
  };

  const octal = decimal.toString(8);
  const octalDigits = octal.split("").map((s) => +s);

  if (octalDigits.length !== 6)
    return [
      undefined,
      new AppValidationError(
        `Decimal ${decimal} is represented as ${octal} in octal. To parse Unix rights, we need the octal number to be 6 digits long.`,
      ),
    ];

  const [, , , userDigit, groupDigit, otherDigit] = octalDigits;

  if (typeof userDigit === "undefined")
    throw new AppValidationError(
      `User permissions not found on ${octal} file mode.`,
    );
  if (userDigit < 1 || userDigit > 7)
    throw new AppValidationError(
      `User permissions are represented in a number ranging from 1 to 7.`,
    );

  if (typeof groupDigit === "undefined")
    throw new AppValidationError(
      `Group permissions not found on ${octal} file mode.`,
    );
  if (groupDigit < 1 || groupDigit > 7)
    throw new AppValidationError(
      `Group permissions are represented in a number ranging from 1 to 7.`,
    );

  if (typeof otherDigit === "undefined")
    throw new AppValidationError(
      `Other permissions not found on ${octal} file mode.`,
    );
  if (otherDigit < 1 || otherDigit > 7)
    throw new AppValidationError(
      `Other permissions are represented in a number ranging from 1 to 7.`,
    );

  const userBits = userDigit
    .toString(2)
    .split("")
    .map((b) => +b);
  const groupBits = groupDigit
    .toString(2)
    .split("")
    .map((b) => +b);
  const otherBits = otherDigit
    .toString(2)
    .split("")
    .map((b) => +b);

  for (const [index, bit] of userBits.entries()) {
    if (index === 0 && bit === 1) rights.user += READ;
    if (index === 1 && bit === 1) rights.user += WRITE;
    if (index === 2 && bit === 1) rights.user += EXECUTE;
  }

  for (const [index, bit] of groupBits.entries()) {
    if (index === 0 && bit === 1) rights.group += READ;
    if (index === 1 && bit === 1) rights.group += WRITE;
    if (index === 2 && bit === 1) rights.group += EXECUTE;
  }

  for (const [index, bit] of otherBits.entries()) {
    if (index === 0 && bit === 1) rights.other += READ;
    if (index === 1 && bit === 1) rights.other += WRITE;
    if (index === 2 && bit === 1) rights.other += EXECUTE;
  }

  return [rights, undefined];
};

export default fileRightsSetFromDecimalMode;
