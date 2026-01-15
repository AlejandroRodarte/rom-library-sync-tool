import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import typeGuards from "../typescript/guards/index.js";

const integerFromRights = (
  rights: string,
): [number, undefined] | [undefined, AppValidationError] => {
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

  if (!typeGuards.isRightList(uniqueRights))
    return [
      undefined,
      new AppValidationError(
        `A right can only be made up of three characters: r, w, and x. ${rights} does not meet this criteria.`,
      ),
    ];

  let acc = 0;

  for (const right of uniqueRights)
    switch (right) {
      case "r":
        acc += 4;
        break;
      case "w":
        acc += 2;
      case "x":
        acc += 1;
        break;
    }

  return [acc, undefined];
};

export default integerFromRights;
