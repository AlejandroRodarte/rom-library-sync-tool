import type {
  ES_DE_GAMELISTS,
  MEDIA,
  ROMS,
} from "../../constants/content-targets/content-target-names.constants.js";
import type { ConsoleContent } from "../../types/consoles/console-content.type.js";
import type { ConsolePaths } from "../../types/consoles/console-paths.types.js";
import type { MediaPaths } from "../../types/media/media-paths.type.js";

export interface DatabaseDirPaths {
  [ROMS]: {
    base: string; // $DATABASE_ROMS_DIR_PATH/
    consoles: ConsolePaths; // $DATABASE_ROMS_DIR_PATH/<console>/
  };
  [MEDIA]: {
    base: string; // $DATABASE_MEDIA_DIR_PATH/
    consoles: ConsoleContent<MediaPaths>; // $DATABASE_MEDIA_DIR_PATH/<console>/<media-name>/
  };
  [ES_DE_GAMELISTS]: {
    base: string; // $DATABASE_ES_DE_GAMELISTS_DIR_PATH/
    consoles: ConsolePaths; // $DATABASE_ES_DE_GAMELISTS_DIR_PATH/<console>/
  };
}
