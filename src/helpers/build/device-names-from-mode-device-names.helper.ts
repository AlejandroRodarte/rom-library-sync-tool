import type { ModeName } from "../../types/mode-name.type.js";
import intersectStringArraySimple from "./intersect-string-array-simple.helper.js";

const deviceNamesFromModeDeviceNames = (
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
      deviceNames = intersectStringArraySimple(
        modeDeviceNames.diff,
        modeDeviceNames.sync,
      );
      break;
    }
    case "sync-list": {
      deviceNames = intersectStringArraySimple(
        modeDeviceNames.sync,
        modeDeviceNames.list,
      );
      break;
    }
    case "diff-sync-list":
    case "list-diff-sync-list": {
      deviceNames = intersectStringArraySimple(
        modeDeviceNames.diff,
        intersectStringArraySimple(modeDeviceNames.list, modeDeviceNames.sync),
      );
      break;
    }
  }

  return deviceNames;
};

export default deviceNamesFromModeDeviceNames;
