import ALL_MEDIA_DIFF_ACTION_TYPES from "../../../constants/media/all-media-diff-action-types.constant.js";
import type { MediaDiffActionType } from "../../../types/classes/devices/generic-device/media/media-diff-action-type.type.js";

const isMediaDiffActionType = (s: string): s is MediaDiffActionType =>
  ALL_MEDIA_DIFF_ACTION_TYPES.includes(s as MediaDiffActionType);

export default isMediaDiffActionType;
