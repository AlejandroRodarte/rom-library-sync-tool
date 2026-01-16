import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface SteamDeckLCDAlejandroProjectListsDirPaths {
  roms: string; // devices/steam-deck-lcd-alejandro/lists/roms/
  media: {
    base: string; // devices/steam-deck-lcd-alejandro/lists/media/
    names: Partial<MediaPaths>; // devices/steam-deck-lcd-alejandro/lists/media/<media-name>/
  };
}
