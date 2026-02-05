import type { ModeSkipFlags } from "../../../interfaces/modes/mode-skip-flags.interface.js";
import type { MediaContent } from "../../../types/media/media-content.type.js";
import type { MediaName } from "../../../types/media/media-name.type.js";

const buildModeSkipFlags = (mediaNames: MediaName[]): ModeSkipFlags => ({
  global: false,
  "content-targets": {
    roms: false,
    media: {
      global: false,
      names: Object.fromEntries(mediaNames.map((m) => [m, false])) as Partial<
        MediaContent<boolean>
      >,
    },
    "es-de-gamelists": false,
  },
});

export default buildModeSkipFlags;
