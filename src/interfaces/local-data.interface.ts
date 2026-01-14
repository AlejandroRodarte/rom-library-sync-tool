import type { ModeName } from "../types/mode-name.type.js";
import type { LocalModeData } from "./local-mode-data.interface.js";

export interface LocalData {
  paths: {
    roms: string;
  };
  modes: {
    [M in ModeName]: LocalModeData<M>;
  };
}
