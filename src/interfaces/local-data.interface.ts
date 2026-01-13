import type { ConsoleName } from "../types/console-name.type.js";
import type { ModeContent } from "../types/mode-content.type.js";

export interface LocalData {
  paths: {
    roms: string;
  };
  modes: ModeContent<{ consoles: ConsoleName[] }>;
}
