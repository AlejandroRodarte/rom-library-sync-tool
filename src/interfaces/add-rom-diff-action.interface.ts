import type { ADD_ROM } from "../constants/rom-diff-action-types.constants.js";
import type { RomFsType } from "../types/rom-fs-type.type.js";

export interface AddRomDiffAction {
  type: typeof ADD_ROM;
  data: {
    filename: string;
    fs: {
      type: RomFsType;
    };
  };
}
