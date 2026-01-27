import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface AlejandroG751JTProjectListsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/lists/roms/<console>.list.txt
  };
  media: { consoles: Partial<ConsoleContent<Partial<MediaPaths>>> }; // devices/alejandro-g751jt/lists/media/<media-name>/<console>.list.txt
  "es-de-gamelists": {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/lists/es-de-gamelists/<console>.list.xml
  };
}
