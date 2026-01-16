import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface AlejandroG751JTContentTargetsDirPaths {
  roms: {
    base: string; // $ALEJANDRO_G751JT_CONTENT_TARGET_ROMS_DIR_PATH/
    consoles: Partial<ConsolePaths>; // $ALEJANDRO_G751JT_CONTENT_TARGET_ROMS_DIR_PATH/<console>/
  };
  media: {
    base: string; // $ALEJANDRO_G751JT_CONTENT_TARGET_MEDIA_DIR_PATH/
    consoles: Partial<
      ConsoleContent<{ base: string; names: Partial<MediaPaths> }>
    >; // $ALEJANDRO_G751JT_CONTENT_TARGET_MEDIA_DIR_PATH/<console>/<media-name>/
  };
  "es-de-gamelists": {
    base: string; // $ALEJANDRO_G751JT_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH/
    consoles: Partial<ConsolePaths>; // $ALEJANDRO_G751JT_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH/<console>/
  };
}
