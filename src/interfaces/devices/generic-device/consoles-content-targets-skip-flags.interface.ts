import type { MediaContent } from "../../../types/media-content.type.js";

export interface ConsolesContentTargetsSkipFlags {
  roms: boolean;
  media: {
    global: boolean;
    names: Partial<MediaContent<boolean>>;
  };
  "es-de-gamelists": boolean;
}
