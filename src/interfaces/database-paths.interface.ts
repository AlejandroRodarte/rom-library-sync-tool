import type { ConsoleContent } from "../types/console-content.type.js";
import type { ConsolePaths } from "../types/console-paths.types.js";
import type { MediaPaths } from "../types/media-paths.type.js";

export interface DatabasePaths {
  dirs: {
    roms: {
      base: string; // $ROMS_DATABASE_DIR_PATH/
      consoles: ConsolePaths; // $ROMS_DATABASE_DIR_PATH/<console>/
    };
    media: {
      base: string; // $MEDIA_DATABASE_DIR_PATH/
      consoles: ConsoleContent<MediaPaths>; // $MEDIA_DATABASE_DIR_PATH/<console>/<media-name>/
    };
    metadata: {
      base: string; // $METADATA_DATABASE_DIR_PATH/
      consoles: ConsolePaths; // $METADATA_DATABASE_DIR_PATH/<console>/
    };
  };
  files: {
    metadata: {
      consoles: ConsolePaths; // $METADATA_DATABASE_DIR_PATH/<console>/gamelist.xml
    };
  };
}
