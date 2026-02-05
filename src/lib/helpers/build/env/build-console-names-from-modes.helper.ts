import type { ConsoleName } from "../../../types/consoles/console-name.type.js";
import type { ModeName } from "../../../types/modes/mode-name.type.js";
import buildIntersectedStringArray from "../build-intersected-string-array.helper.js";

const buildConsoleNamesFromModes = (
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
      consoleNames = buildIntersectedStringArray(
        modeConsoleNames.diff,
        modeConsoleNames.sync,
      );
      break;
    }
    case "sync-list": {
      consoleNames = buildIntersectedStringArray(
        modeConsoleNames.sync,
        modeConsoleNames.list,
      );
      break;
    }
    case "diff-sync-list":
    case "list-diff-sync-list": {
      consoleNames = buildIntersectedStringArray(
        modeConsoleNames.diff,
        buildIntersectedStringArray(
          modeConsoleNames.list,
          modeConsoleNames.sync,
        ),
      );
      break;
    }
  }

  return consoleNames;
};

export default buildConsoleNamesFromModes;
