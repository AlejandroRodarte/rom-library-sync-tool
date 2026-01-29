import type { ConsoleName } from "../types/console-name.type.js";
import type { Media } from "../types/media.type.js";
import type { Roms } from "../types/roms.type.js";
import type { ConsoleData } from "./console-data.interface.js";

export interface DiffConsoleData {
  name: ConsoleName;
  roms: {
    all: Roms;
    selected: Roms;
  };
  data: ConsoleData;
  medias: Media;
}
