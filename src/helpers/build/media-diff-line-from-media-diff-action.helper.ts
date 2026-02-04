import DIFF_LINE_SEPARATOR from "../../constants/diff-line-separator.constant.js";
import {
  ADD_MEDIA,
  DELETE_MEDIA,
} from "../../constants/media-diff-action-types.constants.js";
import type { MediaDiffAction } from "../../types/media-diff-action.type.js";

const mediaDiffLineFromMediaDiffAction = (
  diffAction: MediaDiffAction,
): string => {
  switch (diffAction.type) {
    case ADD_MEDIA:
      return `${ADD_MEDIA}${DIFF_LINE_SEPARATOR}${diffAction.data.fs.type}${DIFF_LINE_SEPARATOR}${diffAction.data.filename}`;
    case DELETE_MEDIA:
      return `${DELETE_MEDIA}${DIFF_LINE_SEPARATOR}${diffAction.data.fs.type}${DIFF_LINE_SEPARATOR}${diffAction.data.filename}`;
  }
};

export default mediaDiffLineFromMediaDiffAction;
