import type { ConsoleContent } from "../types/console-content.type.js";
import type { ConsolePaths } from "../types/console-paths.types.js";
import type { MediaPaths } from "../types/media-paths.type.js";

export interface DatabaseDirPaths {
  roms: {
    base: string; // $DATABASE_ROMS_DIR_PATH/
    consoles: ConsolePaths; // $DATABASE_ROMS_DIR_PATH/<console>/
  };
  media: {
    base: string; // $DATABASE_MEDIA_DIR_PATH/
    consoles: ConsoleContent<MediaPaths>; // $DATABASE_MEDIA_DIR_PATH/<console>/<media-name>/
  };
  "es-de-gamelists": {
    base: string; // $DATABASE_ES_DE_GAMELISTS_DIR_PATH/
    consoles: ConsolePaths; // $DATABASE_ES_DE_GAMELISTS_DIR_PATH/<console>/
  };
}
