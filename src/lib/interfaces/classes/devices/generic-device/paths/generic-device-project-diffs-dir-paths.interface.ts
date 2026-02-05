import type { MediaPaths } from "../../../../../types/media/media-paths.type.js";

export interface GenericDeviceProjectDiffsDirPaths {
  roms: string; // devices/<device>/diffs/roms/
  media: {
    base: string; // devices/<device>/diffs/media/
    names: Partial<MediaPaths>; // devices/<device>/diffs/media/<media-name>/
  };
  "es-de-gamelists": string; // devices/<device>/diffs/es-de-gamelists/
}
