import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface AlejandroG751JTProjectDiffsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/alejandro-g751jt/diffs/roms/<console>.diff.txt
  };
  media: { consoles: Partial<ConsoleContent<Partial<MediaPaths>>> }; // devices/alejandro-g751jt/diffs/media/<media-name>/<console>.diff.txt
}
