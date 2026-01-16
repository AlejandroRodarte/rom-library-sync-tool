import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface AlejandroG751JTProjectFailedDirPaths {
  roms: string; // devices/alejandro-g751jt/failed/roms/
  media: {
    base: string; // devices/alejandro-g751jt/failed/media/
    names: Partial<MediaPaths>; // devices/alejandro-g751jt/failed/media/<media-name>/
  };
}
