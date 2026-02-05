import AppValidationError from "../../../../../classes/errors/app-validation-error.class.js";
import CONSOLE_NAMES_ALL_NONE_AND_REST from "../../../../../constants/consoles/console-names-all-none-and-rest.constant.js";
import type { GenericDeviceConsolesEnvData } from "../../../../../types/classes/devices/generic-device/env/generic-device-consoles-env-data.type.js";
import type { ConsoleContent } from "../../../../../types/consoles/console-content.type.js";
import type { ConsoleName } from "../../../../../types/consoles/console-name.type.js";
import mediaNames from "../../../../build/env/media-names.helper.js";
import typeGuards from "../../../../typescript/guards/index.js";

const populateGenericDeviceConsolesEnvDataMediaNamesFromRawObject = (
  consolesEnvData: GenericDeviceConsolesEnvData,
  rawObject: { [key: string]: string | string[] },
): AppValidationError | undefined => {
  const consoleNames: ConsoleName[] = Object.values(consolesEnvData).map(
    (cd) => cd.name,
  );

  const processedConsoles: Partial<
    ConsoleContent<{ name: ConsoleName; processed: boolean }>
  > = Object.fromEntries(
    consoleNames.map((c) => [c, { name: c, processed: false }]),
  );

  for (const [consoleKey, rawMediaNames] of Object.entries(rawObject)) {
    let finished = false;
    if (finished) break;

    if (!typeGuards.isConsoleNameAllNoneOrRest(consoleKey))
      return new AppValidationError(
        `Console key ${consoleKey} is invalid. It must be one of the following values: ${CONSOLE_NAMES_ALL_NONE_AND_REST.join(", ")}.`,
      );

    const [consoleMediaNames, mediaNamesValidationError] =
      mediaNames(rawMediaNames);
    if (mediaNamesValidationError) return mediaNamesValidationError;

    switch (consoleKey) {
      case "all": {
        for (const [, consoleEnvData] of Object.entries(consolesEnvData)) {
          consoleEnvData["content-targets"].media.names.length = 0;
          consoleEnvData["content-targets"].media.names.push(
            ...consoleMediaNames,
          );
        }
        finished = true;
        break;
      }
      case "none": {
        for (const [, consoleEnvData] of Object.entries(consolesEnvData))
          consoleEnvData["content-targets"].media.names.length = 0;
        finished = true;
        break;
      }
      case "rest": {
        for (const [, processedConsole] of Object.entries(processedConsoles)) {
          if (processedConsole.processed) continue;

          const consoleEnvData = consolesEnvData[processedConsole.name];
          if (!consoleEnvData) continue;

          consoleEnvData["content-targets"].media.names.length = 0;
          consoleEnvData["content-targets"].media.names.push(
            ...consoleMediaNames,
          );
        }
        finished = true;
        break;
      }
      default: {
        if (!consoleNames.includes(consoleKey)) {
          console.warn(
            `Console environment data only contemplates the following consoles: ${consoleNames.join(", ")}. However, you have provided media names for console ${consoleKey}. Will simply ignore it.`,
          );
          break;
        }

        const consoleEnvData = consolesEnvData[consoleKey];
        if (!consoleEnvData) continue;

        consoleEnvData["content-targets"].media.names.length = 0;
        consoleEnvData["content-targets"].media.names.push(
          ...consoleMediaNames,
        );

        const processedConsole = processedConsoles[consoleKey];
        if (!processedConsole) continue;
        processedConsole.processed = true;

        if (Object.values(processedConsoles).every((c) => c.processed))
          finished = true;
        break;
      }
    }
  }
};

export default populateGenericDeviceConsolesEnvDataMediaNamesFromRawObject;
