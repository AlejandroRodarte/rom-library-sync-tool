import type { MediaContent } from "../../../types/media-content.type.js";

export interface AlejandroG751JTConsolesContentTargetsSkipFlags {
  roms: boolean;
  media: {
    global: boolean;
    names: Partial<MediaContent<boolean>>;
  };
  "es-de-gamelists": boolean;
}
