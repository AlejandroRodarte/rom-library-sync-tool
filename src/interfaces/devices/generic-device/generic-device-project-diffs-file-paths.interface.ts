import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface GenericDeviceProjectDiffsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/<device>/diffs/roms/<console>.diff.txt
  };
  media: { consoles: Partial<ConsoleContent<Partial<MediaPaths>>> }; // devices/<device>/diffs/media/<media-name>/<console>.diff.txt
  "es-de-gamelists": {
    consoles: Partial<ConsolePaths>; // devices/<device>/diffs/es-de-gamelists/<console>.diff.xml
  };
}
