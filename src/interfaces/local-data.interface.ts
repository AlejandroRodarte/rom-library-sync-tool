import type { ConsoleName } from "../types/console-name.type.js";

export interface LocalData {
  sync: boolean;
  paths: {
    roms: string;
  };
  consoles: ConsoleName[];
}
