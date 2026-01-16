import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface SteamDeckLCDAlejandroProjectDiffsDirPaths {
  roms: string; // devices/steam-deck-lcd-alejandro/diffs/roms/
  media: {
    base: string; // devices/steam-deck-lcd-alejandro/diffs/media/
    names: Partial<MediaPaths>; // devices/steam-deck-lcd-alejandro/diffs/media/<media-name>/
  };
}
