import type { RomFsType } from "../types/rom-fs-type.type.js";

export interface AddMediaDiffAction {
  type: "add-media";
  data: {
    rom: {
      basename: string;
      fs: {
        type: RomFsType;
      };
    };
  };
}
