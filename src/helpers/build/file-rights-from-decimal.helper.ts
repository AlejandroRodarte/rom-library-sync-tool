import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import type { FileRights } from "../../interfaces/file-rights.helper.js";

const rightsFromDecimal = (
  decimal: number,
): [FileRights, undefined] | [undefined, AppValidationError] => {
  const rights: FileRights = {
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

  const userBits = userDigit.toString(2);
  const groupBits = groupDigit.toString(2);
  const otherBits = otherDigit.toString(2);

  for (const [index, bit] of userBits.split("").entries()) {
    if (index === 0 && bit === "1") rights.user += "r";
    if (index === 1 && bit === "1") rights.user += "w";
    if (index === 2 && bit === "1") rights.user += "x";
  }

  for (const [index, bit] of groupBits.split("").entries()) {
    if (index === 0 && bit === "1") rights.group += "r";
    if (index === 1 && bit === "1") rights.group += "w";
    if (index === 2 && bit === "1") rights.group += "x";
  }

  for (const [index, bit] of otherBits.split("").entries()) {
    if (index === 0 && bit === "1") rights.other += "r";
    if (index === 1 && bit === "1") rights.other += "w";
    if (index === 2 && bit === "1") rights.other += "x";
  }

  return [rights, undefined];
};

export default rightsFromDecimal;
