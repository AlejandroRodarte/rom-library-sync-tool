import type { MediaContent } from "../types/media-content.type.js";

export interface SteamDeckConsolesSkipFlags {
  global: boolean;
  filter: boolean;
  sync: {
    global: boolean;
    roms: boolean;
    media: {
      global: boolean;
      names: MediaContent<boolean>;
    };
    metadata: boolean;
  };
}
