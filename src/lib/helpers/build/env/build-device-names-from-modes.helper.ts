import type { ModeName } from "../../../types/modes/mode-name.type.js";
import buildIntersectedStringArray from "../build-intersected-string-array.helper.js";

const deviceNamesFromModes = (
  mode: ModeName,
  modeDeviceNames: { list: string[]; diff: string[]; sync: string[] },
): string[] => {
  let deviceNames: string[] = [];

  switch (mode) {
    case "list": {
      deviceNames = modeDeviceNames.list;
      break;
    }
    case "diff": {
      deviceNames = modeDeviceNames.diff;
      break;
    }
    case "sync": {
      deviceNames = modeDeviceNames.sync;
      break;
    }
    case "diff-sync": {
      deviceNames = buildIntersectedStringArray(
        modeDeviceNames.diff,
        modeDeviceNames.sync,
      );
      break;
    }
    case "sync-list": {
      deviceNames = buildIntersectedStringArray(
        modeDeviceNames.sync,
        modeDeviceNames.list,
      );
      break;
    }
    case "diff-sync-list":
    case "list-diff-sync-list": {
      deviceNames = buildIntersectedStringArray(
        modeDeviceNames.diff,
        buildIntersectedStringArray(modeDeviceNames.list, modeDeviceNames.sync),
      );
      break;
    }
  }

  return deviceNames;
};

export default deviceNamesFromModes;
