import DIFF_LINE_SEPARATOR from "../../constants/diff-line-separator.constant.js";
import {
  ADD_ROM,
  DELETE_ROM,
} from "../../constants/rom-diff-action-types.constants.js";
import type { RomDiffAction } from "../../types/rom-diff-action.type.js";

const romDiffLineFromRomDiffAction = (diffAction: RomDiffAction): string => {
  switch (diffAction.type) {
    case ADD_ROM:
      return `${ADD_ROM}${DIFF_LINE_SEPARATOR}${diffAction.data.fs.type}${DIFF_LINE_SEPARATOR}${diffAction.data.filename}`;
    case DELETE_ROM:
      return `${DELETE_ROM}${DIFF_LINE_SEPARATOR}${diffAction.data.fs.type}${DIFF_LINE_SEPARATOR}${diffAction.data.filename}`;
  }
};

export default romDiffLineFromRomDiffAction;
