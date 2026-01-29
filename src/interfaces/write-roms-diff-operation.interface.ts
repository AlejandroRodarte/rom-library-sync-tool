import type Roms from "../classes/roms.class.js";
import type { ConsoleName } from "../types/console-name.type.js";

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
      all: Roms;
      selected: Roms;
    };
  };
}
