import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface SteamDeckLCDAlejandroProjectFailedDirPaths {
  roms: string; // devices/steam-deck-lcd-alejandro/failed/roms/
  media: {
    base: string; // devices/steam-deck-lcd-alejandro/failed/media/
    names: Partial<MediaPaths>; // devices/steam-deck-lcd-alejandro/failed/media/<media-name>/
  };
}
