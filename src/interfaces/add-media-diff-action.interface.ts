import type { ADD_MEDIA } from "../constants/media-diff-action-types.constants.js";
import type { MediaFsType } from "../types/media-fs-type.type.js";

export interface AddMediaDiffAction {
  type: typeof ADD_MEDIA;
  data: {
    filename: string;
    fs: {
      type: MediaFsType;
    };
  };
}
