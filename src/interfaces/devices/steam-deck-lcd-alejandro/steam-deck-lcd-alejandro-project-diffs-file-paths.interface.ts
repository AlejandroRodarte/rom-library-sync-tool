import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaContent } from "../../../types/media-content.type.js";

export interface SteamDeckLCDAlejandroProjectDiffsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/steam-deck-lcd-alejandro/diffs/roms/<console>.list.txt
  };
  media: Partial<MediaContent<Partial<ConsolePaths>>>; // devices/steam-deck-lcd-alejandro/diffs/media/<media-name>/<console>.list.txt
}
