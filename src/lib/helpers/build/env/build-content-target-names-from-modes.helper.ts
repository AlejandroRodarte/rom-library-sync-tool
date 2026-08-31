import {
  DIFF,
  DIFF_SYNC,
  LIST,
  LIST_DIFF,
  LIST_DIFF_SYNC,
  SYNC,
} from "../../../constants/modes/mode-names.constants.js";
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
    case LIST: {
      contentTargetNames = modeContentTargetNames.list;
      break;
    }
    case DIFF: {
      contentTargetNames = modeContentTargetNames.diff;
      break;
    }
    case SYNC: {
      contentTargetNames = modeContentTargetNames.sync;
      break;
    }
    case LIST_DIFF: {
      contentTargetNames = buildIntersectedStringArray(
        modeContentTargetNames.list,
        modeContentTargetNames.diff,
      );
      break;
    }
    case DIFF_SYNC: {
      contentTargetNames = buildIntersectedStringArray(
        modeContentTargetNames.diff,
        modeContentTargetNames.sync,
      );
      break;
    }
    case LIST_DIFF_SYNC: {
      contentTargetNames = buildIntersectedStringArray(
        modeContentTargetNames.list,
        buildIntersectedStringArray(
          modeContentTargetNames.diff,
          modeContentTargetNames.sync,
        ),
      );
      break;
    }
  }

  return contentTargetNames;
};

export default buildContentTargetNamesFromModes;
