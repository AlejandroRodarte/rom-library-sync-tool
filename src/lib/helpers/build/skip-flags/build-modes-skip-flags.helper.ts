import type { ModesSkipFlags } from "../../../interfaces/modes/modes-skip-flags.interface.js";
import type { MediaName } from "../../../types/media/media-name.type.js";
import buildModeSkipFlags from "./build-mode-skip-flags.helper.js";

const buildModesSkipFlags = (mediaNames: MediaName[]): ModesSkipFlags => ({
  global: false,
  list: buildModeSkipFlags(mediaNames),
  diff: buildModeSkipFlags(mediaNames),
  sync: buildModeSkipFlags(mediaNames),
});

export default buildModesSkipFlags;
