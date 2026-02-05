import type { ADD_MEDIA } from "../../../../../constants/media/media-diff-action-types.constants.js";
import type { MediaFsType } from "../../../../../types/media/media-fs-type.type.js";

export interface AddMediaDiffAction {
  type: typeof ADD_MEDIA;
  data: {
    filename: string;
    fs: {
      type: MediaFsType;
    };
  };
}
