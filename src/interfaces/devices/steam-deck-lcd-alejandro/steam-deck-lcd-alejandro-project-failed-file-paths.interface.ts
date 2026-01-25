import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaContent } from "../../../types/media-content.type.js";

export interface SteamDeckLCDAlejandroProjectFailedFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/steam-deck-lcd-alejandro/failed/roms/<console>.failed.txt
  };
  media: Partial<MediaContent<Partial<ConsolePaths>>>; // devices/steam-deck-lcd-alejandro/failed/media/<media-name>/<console>.failed.txt
}
