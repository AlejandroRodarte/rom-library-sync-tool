import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaContent } from "../../../types/media-content.type.js";

export interface AlejandroG751JTProjectFailedFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/failed/roms/<console>.list.txt
  };
  media: Partial<MediaContent<Partial<ConsolePaths>>>; // devices/alejandro-g751jt/failed/media/<media-name>/<console>.list.txt
}
