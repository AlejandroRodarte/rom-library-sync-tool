import type { ConsolesSkipFlags } from "../../../../interfaces/devices/generic-device/consoles-skip-flags.interface.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import buildConsolesModeSkipFlags from "./build-consoles-mode-skip-flags.helper.js";

const buildConsolesSkipFlags = (
  mediaNames: MediaName[],
): ConsolesSkipFlags => ({
  global: false,
  list: buildConsolesModeSkipFlags(mediaNames),
  diff: buildConsolesModeSkipFlags(mediaNames),
  sync: buildConsolesModeSkipFlags(mediaNames),
});

export default buildConsolesSkipFlags;
