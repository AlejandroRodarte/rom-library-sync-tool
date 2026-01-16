import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaContent } from "../../../types/media-content.type.js";

export interface AlejandroG751JTProjectListsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/lists/roms/<console>.list.txt
  };
  media: Partial<MediaContent<Partial<ConsolePaths>>>; // devices/alejandro-g751jt/lists/media/<media-name>/<console>.list.txt
}
