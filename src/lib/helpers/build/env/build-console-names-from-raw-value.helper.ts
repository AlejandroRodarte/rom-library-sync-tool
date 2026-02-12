import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import ALL_AND_NONE from "../../../constants/all-and-none.constant.js";
import { ALL, NONE } from "../../../constants/all-none-rest.constants.js";
import ALL_CONSOLE_NAMES from "../../../constants/consoles/all-console-names.constant.js";
import type { ConsoleName } from "../../../types/consoles/console-name.type.js";
import typeGuards from "../../typescript/guards/index.js";

const buildConsoleNamesFromRawValue = (
  rawConsoleNames: string | string[],
): [ConsoleName[], undefined] | [undefined, AppValidationError] => {
  const modeConsoleNames: ConsoleName[] = [];

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
        modeConsoleNames.push(...ALL_CONSOLE_NAMES);
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

    modeConsoleNames.push(...rawConsoleNames);
  }

  return [modeConsoleNames, undefined];
};

export default buildConsoleNamesFromRawValue;
