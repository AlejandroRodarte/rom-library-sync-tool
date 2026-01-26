import type { AlejandroG751JTConsolesModeSkipFlags } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-consoles-mode-skip-flags.interface.js";
import type { MediaContent } from "../../../../types/media-content.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";

const buildConsolesModeSkipFlags = (
  mediaNames: MediaName[],
): AlejandroG751JTConsolesModeSkipFlags => ({
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

export default buildConsolesModeSkipFlags;
