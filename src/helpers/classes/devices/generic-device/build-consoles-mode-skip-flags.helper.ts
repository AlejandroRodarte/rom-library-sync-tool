import type { ConsolesModeSkipFlags } from "../../../../interfaces/devices/generic-device/consoles-mode-skip-flags.interface.js";
import type { MediaContent } from "../../../../types/media-content.type.js";
import type { MediaName } from "../../../../types/media-name.type.js";

const buildConsolesModeSkipFlags = (
  mediaNames: MediaName[],
): ConsolesModeSkipFlags => ({
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
