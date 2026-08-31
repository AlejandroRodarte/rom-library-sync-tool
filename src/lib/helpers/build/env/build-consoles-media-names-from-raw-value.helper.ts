import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import CONSOLE_NAMES_ALL_NONE_AND_REST from "../../../constants/consoles/console-names-all-none-and-rest.constant.js";
import type { ConsolesMediaNames } from "../../../types/consoles/consoles-media-names.type.js";
import type { RawConsolesMediaNames } from "../../../types/env/raw-consoles-media-names.type.js";
import typeGuards from "../../typescript/guards/index.js";
import buildMediaNamesFromRawValue from "./build-media-names-from-raw-value.helper.js";
import { ALL, NONE, REST } from "../../../constants/all-none-rest.constants.js";
import type { ConsoleName } from "../../../types/consoles/console-name.type.js";
import ALL_CONSOLE_NAMES from "../../../constants/consoles/all-console-names.constant.js";
import ALL_MEDIA_NAMES from "../../../constants/media/all-media-names.constant.js";
import isStringArrayASubset from "../../validation/is-string-array-a-subset.helper.js";

const buildConsolesMediaNamesFromRawValue = (
  rawValue: RawConsolesMediaNames,
  validConsolesMediaNames: ConsolesMediaNames = new Map(
    [...ALL_CONSOLE_NAMES].map((c) => [c, [...ALL_MEDIA_NAMES]]),
  ),
): [ConsolesMediaNames, undefined] | [undefined, AppValidationError] => {
  let consolesMediaNames: ConsolesMediaNames = new Map();

  const validConsoleNamesSet = new Set(validConsolesMediaNames.keys());
  const processedConsoleNamesSet = new Set<ConsoleName>();

  let finished = false;

  for (const [consoleName, rawMediaNames] of Object.entries(rawValue)) {
    if (finished) break;

    if (!typeGuards.isConsoleNameAllNoneOrRest(consoleName))
      return [
        undefined,
        new AppValidationError(
          `Found invalid entry: ${consoleName}. Please choose one of the following: ${CONSOLE_NAMES_ALL_NONE_AND_REST.join(", ")}`,
        ),
      ];

    if (consoleName === NONE)
      return [
        undefined,
        new AppValidationError(
          `When configuring media names for consoles, only special keywords "all" and "rest" are allowed. "none" is forbidden.`,
        ),
      ];

    switch (consoleName) {
      case ALL: {
        consolesMediaNames.clear();
        processedConsoleNamesSet.clear();

        for (const [
          validConsoleName,
          validConsoleMediaNames,
        ] of validConsolesMediaNames) {
          const [mediaNames, mediaNamesValidationError] =
            buildMediaNamesFromRawValue(rawMediaNames, validConsoleMediaNames);

          if (mediaNamesValidationError)
            return [undefined, mediaNamesValidationError];

          consolesMediaNames.set(validConsoleName, mediaNames);
          processedConsoleNamesSet.add(validConsoleName);
        }

        finished = true;
        break;
      }
      case REST: {
        const unprocessedConsoleNamesSet = validConsoleNamesSet.difference(
          processedConsoleNamesSet,
        );

        for (const unprocessedConsoleName of unprocessedConsoleNamesSet) {
          const validConsoleMediaNames = validConsolesMediaNames.get(
            unprocessedConsoleName,
          );

          if (!validConsoleMediaNames)
            return [
              undefined,
              new AppValidationError(
                `No media names found for valid console ${unprocessedConsoleName}, yet it is marked as "unprocessed". This should be unreachable.`,
              ),
            ];

          const [mediaNames, mediaNamesValidationError] =
            buildMediaNamesFromRawValue(rawMediaNames, validConsoleMediaNames);
          if (mediaNamesValidationError)
            return [undefined, mediaNamesValidationError];

          consolesMediaNames.set(unprocessedConsoleName, mediaNames);
          processedConsoleNamesSet.add(unprocessedConsoleName);
        }

        finished = true;
        break;
      }
      default: {
        const validConsoleMediaNames = validConsolesMediaNames.get(consoleName);

        if (!validConsoleMediaNames)
          return [
            undefined,
            new AppValidationError(
              `Attempted to set media names for console ${consoleName}. However, this console is not present in the valid console name list. Either include this console in the official list, or delete this configuration.`,
            ),
          ];

        const [mediaNames, mediaNamesValidationError] =
          buildMediaNamesFromRawValue(rawMediaNames, validConsoleMediaNames);
        if (mediaNamesValidationError)
          return [undefined, mediaNamesValidationError];

        consolesMediaNames.set(consoleName, mediaNames);
        processedConsoleNamesSet.add(consoleName);
        break;
      }
    }
  }

  const unprocessedConsoles = validConsoleNamesSet.difference(
    processedConsoleNamesSet,
  );

  if (unprocessedConsoles.size > 0)
    return [
      undefined,
      new AppValidationError(
        `The following consoles do not have their media name list configured: ${unprocessedConsoles.values().toArray().join(", ")}. If you do not want to include a specific media name list for each console, make sure to include a special "rest" property at the end of your configuration.`,
      ),
    ];

  for (const [consoleName, consoleMediaNames] of consolesMediaNames) {
    const validConsoleMediaNames = validConsolesMediaNames.get(consoleName);

    if (!validConsoleMediaNames)
      return [
        undefined,
        new AppValidationError(
          `There are media names for console ${consoleName} in the output media list. However, no such console data is present in the valid consoles media names object. This should be unreachable.`,
        ),
      ];

    if (!isStringArrayASubset(validConsoleMediaNames, consoleMediaNames))
      return [
        undefined,
        new AppValidationError(
          `Console ${consoleName} has media names ${consoleMediaNames.join(", ")} in the output list. However, the "valid" media names list for such console is ${validConsoleMediaNames.join(", ")}. Please make sure the "output list" be a subset of the "valid list".`,
        ),
      ];
  }

  return [consolesMediaNames, undefined];
};

export default buildConsolesMediaNamesFromRawValue;
