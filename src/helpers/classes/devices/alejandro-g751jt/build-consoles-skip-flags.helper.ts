import type { AlejandroG751JTConsolesSkipFlags } from "../../../../interfaces/devices/alejandro-g751jt/alejandro-g751jt-consoles-skip-flags.interface.js";
import type { MediaName } from "../../../../types/media-name.type.js";
import buildConsolesModeSkipFlags from "./build-consoles-mode-skip-flags.helper.js";

const buildConsolesSkipFlags = (
  mediaNames: MediaName[],
): AlejandroG751JTConsolesSkipFlags => ({
  global: false,
  list: buildConsolesModeSkipFlags(mediaNames),
  diff: buildConsolesModeSkipFlags(mediaNames),
  sync: buildConsolesModeSkipFlags(mediaNames),
});

export default buildConsolesSkipFlags;
