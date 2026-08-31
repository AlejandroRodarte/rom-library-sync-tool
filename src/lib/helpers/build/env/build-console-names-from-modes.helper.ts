import {
  DIFF,
  DIFF_SYNC,
  LIST,
  LIST_DIFF,
  LIST_DIFF_SYNC,
  SYNC,
} from "../../../constants/modes/mode-names.constants.js";
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
    case LIST: {
      consoleNames = modeConsoleNames.list;
      break;
    }
    case DIFF: {
      consoleNames = modeConsoleNames.diff;
      break;
    }
    case SYNC: {
      consoleNames = modeConsoleNames.sync;
      break;
    }
    case LIST_DIFF: {
      consoleNames = buildIntersectedStringArray(
        modeConsoleNames.list,
        modeConsoleNames.diff,
      );
      break;
    }
    case DIFF_SYNC: {
      consoleNames = buildIntersectedStringArray(
        modeConsoleNames.diff,
        modeConsoleNames.sync,
      );
      break;
    }
    case LIST_DIFF_SYNC: {
      consoleNames = buildIntersectedStringArray(
        modeConsoleNames.list,
        buildIntersectedStringArray(
          modeConsoleNames.diff,
          modeConsoleNames.sync,
        ),
      );
      break;
    }
  }

  return consoleNames;
};

export default buildConsoleNamesFromModes;
