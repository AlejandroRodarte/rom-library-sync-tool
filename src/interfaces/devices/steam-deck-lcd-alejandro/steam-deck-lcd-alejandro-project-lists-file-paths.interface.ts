import type { ConsolePaths } from "../../../types/console-paths.types.js";
import type { MediaContent } from "../../../types/media-content.type.js";

export interface SteamDeckLCDAlejandroProjectListsFilePaths {
  roms: {
    consoles: Partial<ConsolePaths>; // devices/steam-deck-lcd-alejandro/lists/roms/<console>.list.txt
  };
  media: Partial<MediaContent<Partial<ConsolePaths>>>; // devices/steam-deck-lcd-alejandro/lists/media/<media-name>/<console>.list.txt
}
