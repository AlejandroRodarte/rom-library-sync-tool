import type { DELETE_ROM } from "../../../../../constants/roms/rom-diff-action-types.constants.js";
import type { RomFsType } from "../../../../../types/roms/rom-fs-type.type.js";

export interface DeleteRomDiffAction {
  type: typeof DELETE_ROM;
  data: {
    filename: string;
    fs: {
      type: RomFsType;
    };
  };
}
