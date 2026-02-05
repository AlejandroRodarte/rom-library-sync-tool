import type { MediaContent } from "../../types/media/media-content.type.js";

export interface ModeContentTargetsSkipFlags {
  roms: boolean;
  media: {
    global: boolean;
    names: Partial<MediaContent<boolean>>;
  };
  "es-de-gamelists": boolean;
}
