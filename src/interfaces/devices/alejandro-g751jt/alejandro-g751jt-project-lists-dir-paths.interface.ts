import type { MediaPaths } from "../../../types/media-paths.type.js";

export interface AlejandroG751JTProjectListsDirPaths {
  roms: string; // devices/alejandro-g751jt/lists/roms/
  media: {
    base: string; // devices/alejandro-g751jt/lists/media/
    names: Partial<MediaPaths>; // devices/alejandro-g751jt/lists/media/<media-name>/
  };
}
