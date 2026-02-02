import type { MediaFsType } from "../types/media-fs-type.type.js";

export interface AddMediaDiffAction {
  type: "add-media";
  data: {
    filename: string;
    fs: {
      type: MediaFsType;
    };
  };
}
