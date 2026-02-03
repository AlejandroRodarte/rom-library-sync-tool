import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import ALL_OR_NONE from "../../constants/all-or-none.constant.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import typeGuards from "../typescript/guards/index.js";

const consoleNames = (
  rawConsoleNames: string | string[],
): [ConsoleName[], undefined] | [undefined, AppValidationError] => {
  const modeConsoleNames: ConsoleName[] = [];

  if (typeof rawConsoleNames === "string") {
    if (!typeGuards.isAllOrNone(rawConsoleNames))
      return [
        undefined,
        new AppValidationError(
          `When list console names is provided as a sole string, only two values are accepted: ${ALL_OR_NONE.join(", ")}.`,
        ),
      ];

    switch (rawConsoleNames) {
      case "all":
        modeConsoleNames.push(...CONSOLE_NAMES);
        break;
      case "none":
        break;
    }
  } else {
    if (!typeGuards.isConsoleList(rawConsoleNames))
      return [
        undefined,
        new AppValidationError(
          `Only these console names are allowed: ${CONSOLE_NAMES.join(", ")}. Your list ${rawConsoleNames} has a console name that is not part of the official list.`,
        ),
      ];

    modeConsoleNames.push(...rawConsoleNames);
  }

  return [modeConsoleNames, undefined];
};

export default consoleNames;
