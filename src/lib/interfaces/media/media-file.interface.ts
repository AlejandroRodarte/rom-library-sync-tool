import type { FILE } from "../../constants/fs/fs-types.constants.js";

export interface MediaFile {
  type: typeof FILE;
  file: {
    type: string;
  };
}
