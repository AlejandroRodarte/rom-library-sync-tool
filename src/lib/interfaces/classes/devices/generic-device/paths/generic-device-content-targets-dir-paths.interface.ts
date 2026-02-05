import type { ConsoleContent } from "../../../../../types/consoles/console-content.type.js";
import type { ConsolePaths } from "../../../../../types/consoles/console-paths.types.js";
import type { MediaPaths } from "../../../../../types/media/media-paths.type.js";

export interface GenericDeviceContentTargetsDirPaths {
  roms: {
    base: string; // $CONTENT_TARGET_ROMS_DIR_PATH/
    consoles: Partial<ConsolePaths>; // $CONTENT_TARGET_ROMS_DIR_PATH/<console>/
  };
  media: {
    base: string; // $CONTENT_TARGET_MEDIA_DIR_PATH/
    consoles: Partial<
      ConsoleContent<{ base: string; names: Partial<MediaPaths> }>
    >; // $CONTENT_TARGET_MEDIA_DIR_PATH/<console>/<media-name>/
  };
  "es-de-gamelists": {
    base: string; // $CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH/
    consoles: Partial<ConsolePaths>; // $CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH/<console>/
  };
}
