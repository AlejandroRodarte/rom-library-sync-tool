import type ALL_ROM_TITLE_NAME_BUILD_STRATEGIES from "../../constants/roms/all-rom-title-name-build-strategies.constant.js";

export type RomTitleNameBuildStrategy =
  (typeof ALL_ROM_TITLE_NAME_BUILD_STRATEGIES)[number];
