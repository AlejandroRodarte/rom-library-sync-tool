import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface AlejandroG751JTProjectFailedFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/failed/roms/<console>.failed.txt
  };
  media: { consoles: Partial<ConsoleContent<Partial<MediaPaths>>> }; // devices/alejandro-g751jt/failed/media/<media-name>/<console>.failed.txt
  "es-de-gamelists": {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/failed/es-de-gamelists/<console>.failed.txt
  };
}
