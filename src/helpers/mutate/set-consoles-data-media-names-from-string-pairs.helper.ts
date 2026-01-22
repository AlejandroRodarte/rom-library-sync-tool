import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import MEDIA_NAMES from "../../constants/media-names.constant.js";
import type { ConsoleContent } from "../../types/console-content.type.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { ConsolesData } from "../../types/consoles-data.type.js";
import mediaNamesFromMediasList from "../build/media-names-from-medias-list.helper.js";
import typeGuards from "../typescript/guards/index.js";

const setConsolesDataMediaNamesFromStringPairs = (
  consolesData: ConsolesData,
  pairs: string[],
): AppValidationError | undefined => {
  const consoleNames: ConsoleName[] = Object.entries(consolesData).map(
    ([, c]) => c.name,
  );

  const processedConsoles: Partial<
    ConsoleContent<{ name: ConsoleName; processed: boolean }>
  > = Object.fromEntries(
    consoleNames.map((c) => [c, { name: c, processed: false }]),
  ) as Partial<ConsoleContent<{ name: ConsoleName; processed: boolean }>>;

  for (const pair of pairs) {
    let finished = false;
    if (finished) break;

    const [consolesListItem, rawMediasList] = pair
      .split("=")
      .map((s) => s.trim());

    if (!consolesListItem)
      return new AppValidationError(
        `No console found on pair ${pair}. Each pair must be conformed of a console name, followed by a literal "=", followed by a space-separated list of media names.`,
      );

    if (!typeGuards.isConsolesListItemOrRest(consolesListItem))
      return new AppValidationError(
        `Console ${consolesListItem} is not valid. All consoles in pairs must be one of the following: ${[...CONSOLE_NAMES, "all", "none", "rest"].join(", ")}.`,
      );

    if (consolesListItem === "none") {
      for (const [, consoleData] of Object.entries(consolesData))
        consoleData["content-targets"].media.names.length = 0;
      break;
    }

    if (!rawMediasList)
      return new AppValidationError(
        `No medias list found on pair ${pair}. Each pair must be conformed of a console name, followed by a literal "=", followed by a space-separated list of media names.`,
      );

    const mediasList = rawMediasList.split(";").map((s) => s.trim());

    if (!typeGuards.isMediasList(mediasList))
      return new AppValidationError(
        `${mediasList} is not a valid of of media list items. All media lists in pairs must be one of the following: ${[...MEDIA_NAMES, "all", "none"].join(", ")}.`,
      );

    const mediaNames = mediaNamesFromMediasList(mediasList);

    switch (consolesListItem) {
      case "all": {
        for (const [, consoleData] of Object.entries(consolesData)) {
          consoleData["content-targets"].media.names.length = 0;
          consoleData["content-targets"].media.names.push(...mediaNames);
        }
        finished = true;
        break;
      }
      case "rest": {
        for (const [, processedConsole] of Object.entries(processedConsoles)) {
          if (processedConsole.processed) continue;

          const consoleData = consolesData[processedConsole.name];
          if (consoleData) {
            consoleData["content-targets"].media.names.length = 0;
            consoleData["content-targets"].media.names.push(...mediaNames);
          }
        }
        finished = true;
        break;
      }
      default: {
        if (!consoleNames.includes(consolesListItem))
          return new AppValidationError(
            `You have selected consoles ${consoleNames.join(", ")} for listing. However, we encountered ${consolesListItem}, which is NOT part of that list. Scrap it or include it in the console list.`,
          );

        if (consolesData[consolesListItem]) {
          consolesData[consolesListItem]["content-targets"].media.names.length =
            0;
          consolesData[consolesListItem]["content-targets"].media.names.push(
            ...mediaNames,
          );
        }

        const processedConsole = processedConsoles[consolesListItem];
        if (processedConsole) processedConsole.processed = true;

        if (
          Object.entries(processedConsoles)
            .map(([, processedConsole]) => processedConsole)
            .every((processedConsole) => processedConsole.processed)
        )
          finished = true;
        break;
      }
    }
  }
};

export default setConsolesDataMediaNamesFromStringPairs;
