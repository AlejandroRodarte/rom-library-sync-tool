import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaContent } from "../../../types/media-content.type.js";

export interface AlejandroG751JTProjectDiffsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/diffs/roms/<console>.list.txt
  };
  media: Partial<MediaContent<Partial<ConsolePaths>>>; // devices/alejandro-g751jt/diffs/media/<media-name>/<console>.list.txt
}
