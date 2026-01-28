import type { ConsoleName } from "../types/console-name.type.js";
import type { Medias } from "../types/medias.type.js";
import type { RomSet } from "../types/rom-set.type.js";
import type { ConsoleData } from "./console-data.interface.js";

export interface DiffConsoleData {
  name: ConsoleName;
  roms: {
    all: RomSet;
    selected: RomSet;
  };
  data: ConsoleData;
  medias: Medias;
}
