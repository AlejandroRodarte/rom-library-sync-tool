import type { RomFsType } from "../../types/roms/rom-fs-type.type.js";
import type { RomLanguage } from "../../types/roms/rom-language.type.js";

export interface Rom {
  base: {
    name: string;
  };
  file: {
    name: string;
    type: string;
  };
  fs: {
    type: RomFsType;
  };
  labels: string[];
  languages: RomLanguage[];
}
