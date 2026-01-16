import type { ConsoleContent } from "../../../types/console-content.type.js";
import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface SteamDeckLCDAlejandroContentTargetsDirPaths {
  roms: {
    base: string; // $STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ROMS_DIR_PATH/
    consoles: Partial<ConsolePaths>; // $STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ROMS_DIR_PATH/<console>/
  };
  media: {
    base: string; // $STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_MEDIA_DIR_PATH/
    consoles: Partial<
      ConsoleContent<{ base: string; names: Partial<MediaPaths> }>
    >; // $STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_MEDIA_DIR_PATH/<console>/<media-name>/
  };
  "es-de-gamelists": {
    base: string; // $STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH/
    consoles: Partial<ConsolePaths>; // $STEAM_DECK_LCD_ALEJANDRO_CONTENT_TARGET_ES_DE_GAMELISTS_DIR_PATH/<console>/
  };
}
