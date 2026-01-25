import type { RomFsType } from "../types/rom-fs-type.type.js";

export interface DeleteMediaDiffAction {
  type: "delete-media";
  data: {
    rom: {
      basename: string;
      fs: {
        type: RomFsType;
      };
    };
  };
}
