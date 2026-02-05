import type { ConsoleContent } from "../../../../../types/consoles/console-content.type.js";
import type { ConsolePaths } from "../../../../../types/consoles/console-paths.types.js";
import type { MediaPaths } from "../../../../../types/media/media-paths.type.js";

export interface GenericDeviceProjectFailedFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/<device>/failed/roms/<console>.failed.txt
  };
  media: { consoles: Partial<ConsoleContent<Partial<MediaPaths>>> }; // devices/<device>/failed/media/<media-name>/<console>.failed.txt
  "es-de-gamelists": {
    consoles: Partial<ConsolePaths>; // devices/<device>/failed/es-de-gamelists/<console>.failed.txt
  };
}
