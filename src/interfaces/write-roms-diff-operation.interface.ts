import type { ConsoleName } from "../types/console-name.type.js";
import type { RomSet } from "../types/rom-set.type.js";

export interface WriteRomsDiffOperation {
  paths: {
    project: {
      list: {
        file: string;
      };
      diff: {
        file: string;
      };
    };
  };
  console: {
    name: ConsoleName;
    roms: {
      all: RomSet;
      selected: RomSet;
    };
  };
}
