import type { MediaContent } from "../../../types/media-content.type.js";

export interface AlejandroG751JTShouldProcessContentTargetFlags {
  roms: boolean;
  media: {
    global: boolean;
    names: Partial<MediaContent<boolean>>;
  };
  "es-de-gamelists": boolean;
}
