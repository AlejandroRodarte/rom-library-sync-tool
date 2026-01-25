import type { RomFsType } from "../types/rom-fs-type.type.js";

export interface AddRomDiffAction {
  type: "add-rom";
  data: {
    filename: string;
    fs: {
      type: RomFsType;
    };
  };
}
