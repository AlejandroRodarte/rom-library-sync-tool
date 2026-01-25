import MEDIA_DIFF_ACTION_TYPES from "../../../constants/media-diff-action-types.constant.js";
import type { MediaDiffActionType } from "../../../types/media-diff-action-type.type.js";

const isMediaDiffActionType = (s: string): s is MediaDiffActionType =>
  MEDIA_DIFF_ACTION_TYPES.includes(s as MediaDiffActionType);

export default isMediaDiffActionType;
