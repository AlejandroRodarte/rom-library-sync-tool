import type { MediaPaths } from "../../../../../types/media/media-paths.type.js";

export interface GenericDeviceProjectListsDirPaths {
  roms: string; // devices/<device>/lists/roms/
  media: {
    base: string; // devices/<device>/lists/media/
    names: Partial<MediaPaths>; // devices/<device>/lists/media/<media-name>/
  };
  "es-de-gamelists": string; // devices/<device>/lists/es-de-gamelists/
}
