import type { ConsoleName } from "../../types/console-name.type.js";
import type { ModeName } from "../../types/mode-name.type.js";
import intersectStringArraySimple from "./intersect-string-array-simple.helper.js";

const consoleNamesFromModeConsoleNames = (
  mode: ModeName,
  modeConsoleNames: {
    list: ConsoleName[];
    diff: ConsoleName[];
    sync: ConsoleName[];
  },
): ConsoleName[] => {
  let consoleNames: ConsoleName[] = [];

  switch (mode) {
    case "list": {
      consoleNames = modeConsoleNames.list;
      break;
    }
    case "diff": {
      consoleNames = modeConsoleNames.diff;
      break;
    }
    case "sync": {
      consoleNames = modeConsoleNames.sync;
      break;
    }
    case "diff-sync": {
      consoleNames = intersectStringArraySimple(
        modeConsoleNames.diff,
        modeConsoleNames.sync,
      );
      break;
    }
    case "sync-list": {
      consoleNames = intersectStringArraySimple(
        modeConsoleNames.sync,
        modeConsoleNames.list,
      );
      break;
    }
    case "diff-sync-list":
    case "list-diff-sync-list": {
      consoleNames = intersectStringArraySimple(
        modeConsoleNames.diff,
        intersectStringArraySimple(
          modeConsoleNames.list,
          modeConsoleNames.sync,
        ),
      );
      break;
    }
  }

  return consoleNames;
};

export default consoleNamesFromModeConsoleNames;
