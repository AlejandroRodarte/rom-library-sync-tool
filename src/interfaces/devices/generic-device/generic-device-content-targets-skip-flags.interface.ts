import type { MediaContent } from "../../../types/media-content.type.js";

export interface GenericDeviceContentTargetsSkipFlags {
  roms: boolean;
  media: {
    global: boolean;
    names: Partial<MediaContent<boolean>>;
  };
  "es-de-gamelists": boolean;
}
