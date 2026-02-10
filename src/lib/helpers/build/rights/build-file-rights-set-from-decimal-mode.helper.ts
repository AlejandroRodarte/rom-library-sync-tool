import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import {
  EXECUTE,
  READ,
  WRITE,
} from "../../../constants/rights/rights.constants.js";
import type { FileRightsSet } from "../../../interfaces/file-rights-set.interface.js";

export type BuildFileRightsFromDecimalError = AppValidationError;

const buildFileRightsSetFromDecimalMode = (
  decimal: number,
):
  | [FileRightsSet, undefined]
  | [undefined, BuildFileRightsFromDecimalError] => {
  const rights: FileRightsSet = {
    user: "",
    group: "",
    other: "",
  };

  const octal = decimal.toString(8);
  const octalDigits = octal.split("").map((s) => +s);

  const userDigit = octalDigits.at(octalDigits.length - 3);
  const groupDigit = octalDigits.at(octalDigits.length - 2);
  const otherDigit = octalDigits.at(octalDigits.length - 1);

  if (typeof userDigit === "undefined")
    return [
      undefined,
      new AppValidationError(
        `User permissions not found on ${octal} file mode.`,
      ),
    ];
  if (userDigit < 1 || userDigit > 7)
    return [
      undefined,
      new AppValidationError(
        `User permissions are represented in a number ranging from 1 to 7.`,
      ),
    ];

  if (typeof groupDigit === "undefined")
    return [
      undefined,
      new AppValidationError(
        `Group permissions not found on ${octal} file mode.`,
      ),
    ];
  if (groupDigit < 1 || groupDigit > 7)
    return [
      undefined,
      new AppValidationError(
        `Group permissions are represented in a number ranging from 1 to 7.`,
      ),
    ];

  if (typeof otherDigit === "undefined")
    return [
      undefined,
      new AppValidationError(
        `Other permissions not found on ${octal} file mode.`,
      ),
    ];
  if (otherDigit < 1 || otherDigit > 7)
    return [
      undefined,
      new AppValidationError(
        `Other permissions are represented in a number ranging from 1 to 7.`,
      ),
    ];

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

export default buildFileRightsSetFromDecimalMode;
