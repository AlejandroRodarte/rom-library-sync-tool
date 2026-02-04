import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import { EXECUTE, READ, WRITE } from "../../constants/rights.constants.js";
import typeGuards from "../typescript/guards/index.js";

export type ModeFromRightsError = AppValidationError;

const modeFromRights = (
  rights: string,
): [number, undefined] | [undefined, ModeFromRightsError] => {
  if (!rights) return [0, undefined];

  const rightsList = rights.split("");
  if (rightsList.length > 3)
    return [
      undefined,
      new AppValidationError(
        `A right is made up, at most, three characters (r, w, or x). ${rights} does not meet with this criteria.`,
      ),
    ];

  const uniqueRights = [...new Set(rightsList)];

  if (!typeGuards.isIndividualRightList(uniqueRights))
    return [
      undefined,
      new AppValidationError(
        `A right can only be made up of three characters: r, w, and x. ${rights} does not meet this criteria.`,
      ),
    ];

  let acc = 0;

  for (const right of uniqueRights)
    switch (right) {
      case READ:
        acc += 4;
        break;
      case WRITE:
        acc += 2;
      case EXECUTE:
        acc += 1;
        break;
    }

  return [acc, undefined];
};

export default modeFromRights;
