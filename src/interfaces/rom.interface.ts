import type { RomFsType } from "../types/rom-fs-type.type.js";

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
  languages: string[];
}
