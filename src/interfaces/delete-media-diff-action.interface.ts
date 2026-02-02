import type { MediaFsType } from "../types/media-fs-type.type.js";

export interface DeleteMediaDiffAction {
  type: "delete-media";
  data: {
    filename: string;
    fs: {
      type: MediaFsType;
    };
  };
}
