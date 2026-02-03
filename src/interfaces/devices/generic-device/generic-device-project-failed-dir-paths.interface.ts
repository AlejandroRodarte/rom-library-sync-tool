import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface GenericDeviceProjectFailedDirPaths {
  roms: string; // devices/<device>/failed/roms/
  media: {
    base: string; // devices/<device>/failed/media/
    names: Partial<MediaPaths>; // devices/<device>/failed/media/<media-name>/
  };
  "es-de-gamelists": string; // devices/<device>/failed/es-de-gamelists/
}
