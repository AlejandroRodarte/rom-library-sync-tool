import type { ContentTargetName } from "../../../types/content-targets/content-target-name.type.js";
import type { ModeName } from "../../../types/modes/mode-name.type.js";
import buildIntersectedStringArray from "../build-intersected-string-array.helper.js";

const buildContentTargetNamesFromModes = (
  mode: ModeName,
  modeContentTargetNames: {
    list: ContentTargetName[];
    diff: ContentTargetName[];
    sync: ContentTargetName[];
  },
): ContentTargetName[] => {
  let contentTargetNames: ContentTargetName[] = [];

  switch (mode) {
    case "list": {
      contentTargetNames = modeContentTargetNames.list;
      break;
    }
    case "diff": {
      contentTargetNames = modeContentTargetNames.diff;
      break;
    }
    case "sync": {
      contentTargetNames = modeContentTargetNames.sync;
      break;
    }
    case "diff-sync": {
      contentTargetNames = buildIntersectedStringArray(
        modeContentTargetNames.diff,
        modeContentTargetNames.sync,
      );
      break;
    }
    case "sync-list": {
      contentTargetNames = buildIntersectedStringArray(
        modeContentTargetNames.sync,
        modeContentTargetNames.list,
      );
      break;
    }
    case "diff-sync-list":
    case "list-diff-sync-list": {
      contentTargetNames = buildIntersectedStringArray(
        modeContentTargetNames.diff,
        buildIntersectedStringArray(
          modeContentTargetNames.list,
          modeContentTargetNames.sync,
        ),
      );
      break;
    }
  }

  return contentTargetNames;
};

export default buildContentTargetNamesFromModes;
