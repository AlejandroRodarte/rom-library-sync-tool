import {
  ADD_MEDIA,
  DELETE_MEDIA,
} from "./media-diff-action-types.constants.js";

const ALL_MEDIA_DIFF_ACTION_TYPES = [ADD_MEDIA, DELETE_MEDIA] as const;

export default ALL_MEDIA_DIFF_ACTION_TYPES;
