import type { RomFsType } from "../types/rom-fs-type.type.js";

export interface DeleteRomDiffAction {
  type: "delete-rom";
  data: {
    filename: string;
    fs: {
      type: RomFsType;
    };
  };
}
