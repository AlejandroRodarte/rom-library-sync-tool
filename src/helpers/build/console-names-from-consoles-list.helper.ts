import CONSOLE_NAMES from "../../constants/console-names.constant.js";
import type { ConsoleName } from "../../types/console-name.type.js";
import type { ConsolesList } from "../../types/consoles-list.type.js";

const consoleNamesFromConsolesList = (
  consolesList: ConsolesList,
): ConsoleName[] => {
  const consoleNames: ConsoleName[] = [];

  for (const consolesListItem of consolesList) {
    if (consolesListItem === "none") {
      consoleNames.length = 0;
      break;
    } else if (consolesListItem === "all") {
      consoleNames.length = 0;
      CONSOLE_NAMES.forEach((d) => consoleNames.push(d));
      break;
    } else consoleNames.push(consolesListItem);
  }

  return consoleNames;
};

export default consoleNamesFromConsolesList;
