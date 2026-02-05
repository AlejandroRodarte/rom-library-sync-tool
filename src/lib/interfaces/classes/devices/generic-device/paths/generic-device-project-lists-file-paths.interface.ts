import type { ConsoleContent } from "../../../../../types/consoles/console-content.type.js";
import type { ConsolePaths } from "../../../../../types/consoles/console-paths.types.js";
import type { MediaPaths } from "../../../../../types/media/media-paths.type.js";

export interface GenericDeviceProjectListsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/<device>/lists/roms/<console>.list.txt
  };
  media: { consoles: Partial<ConsoleContent<Partial<MediaPaths>>> }; // devices/<device>/lists/media/<media-name>/<console>.list.txt
  "es-de-gamelists": {
    consoles: Partial<ConsolePaths>; // devices/<device>/lists/es-de-gamelists/<console>.list.xml
  };
}
