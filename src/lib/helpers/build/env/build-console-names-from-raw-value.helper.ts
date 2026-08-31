import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import ALL_AND_NONE from "../../../constants/all-and-none.constant.js";
import { ALL, NONE } from "../../../constants/all-none-rest.constants.js";
import ALL_CONSOLE_NAMES from "../../../constants/consoles/all-console-names.constant.js";
import type { ConsoleName } from "../../../types/consoles/console-name.type.js";
import typeGuards from "../../typescript/guards/index.js";
import isStringArrayASubset from "../../validation/is-string-array-a-subset.helper.js";

const buildConsoleNamesFromRawValue = (
  rawConsoleNames: string | string[],
  validConsoleNames: ConsoleName[] = [...ALL_CONSOLE_NAMES],
): [ConsoleName[], undefined] | [undefined, AppValidationError] => {
  const consoleNames: ConsoleName[] = [];

  if (typeof rawConsoleNames === "string") {
    if (!typeGuards.isAllOrNone(rawConsoleNames))
      return [
        undefined,
        new AppValidationError(
          `When list console names is provided as a sole string, only two values are accepted: ${ALL_AND_NONE.join(", ")}.`,
        ),
      ];

    switch (rawConsoleNames) {
      case ALL:
        consoleNames.push(...[...validConsoleNames]);
        break;
      case NONE:
        break;
    }
  } else {
    if (!typeGuards.isConsoleList(rawConsoleNames))
      return [
        undefined,
        new AppValidationError(
          `Only these console names are allowed: ${ALL_CONSOLE_NAMES.join(", ")}. Your list ${rawConsoleNames} has a console name that is not part of the official list.`,
        ),
      ];

    if (!isStringArrayASubset(validConsoleNames, rawConsoleNames))
      return [
        undefined,
        new AppValidationError(
          `Tried to build a console name list based on the following "official list": ${validConsoleNames.join(", ")}. However, the real list has console names that are NOT part of the official list: ${rawConsoleNames.join(", ")}. Please make sure that the "real list" is a subset of the "official list".`,
        ),
      ];

    consoleNames.push(...[...rawConsoleNames]);
  }

  return [consoleNames, undefined];
};

export default buildConsoleNamesFromRawValue;
