import type { DELETE_MEDIA } from "../constants/media-diff-action-types.constants.js";
import type { MediaFsType } from "../types/media-fs-type.type.js";

export interface DeleteMediaDiffAction {
  type: typeof DELETE_MEDIA;
  data: {
    filename: string;
    fs: {
      type: MediaFsType;
    };
  };
}
