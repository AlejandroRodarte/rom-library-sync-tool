import {
  DIFF,
  DIFF_SYNC,
  LIST,
  LIST_DIFF,
  LIST_DIFF_SYNC,
  SYNC,
} from "../../../constants/modes/mode-names.constants.js";
import type { ModeName } from "../../../types/modes/mode-name.type.js";
import buildIntersectedStringArray from "../build-intersected-string-array.helper.js";

const deviceNamesFromModes = (
  mode: ModeName,
  modeDeviceNames: { list: string[]; diff: string[]; sync: string[] },
): string[] => {
  let deviceNames: string[] = [];

  switch (mode) {
    case LIST: {
      deviceNames = modeDeviceNames.list;
      break;
    }
    case DIFF: {
      deviceNames = modeDeviceNames.diff;
      break;
    }
    case SYNC: {
      deviceNames = modeDeviceNames.sync;
      break;
    }
    case LIST_DIFF: {
      deviceNames = buildIntersectedStringArray(
        modeDeviceNames.list,
        modeDeviceNames.diff,
      );
      break;
    }
    case DIFF_SYNC: {
      deviceNames = buildIntersectedStringArray(
        modeDeviceNames.diff,
        modeDeviceNames.sync,
      );
      break;
    }
    case LIST_DIFF_SYNC: {
      deviceNames = buildIntersectedStringArray(
        modeDeviceNames.list,
        buildIntersectedStringArray(modeDeviceNames.diff, modeDeviceNames.sync),
      );
      break;
    }
  }

  return deviceNames;
};

export default deviceNamesFromModes;
