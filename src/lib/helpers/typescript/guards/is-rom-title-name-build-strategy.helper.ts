import ALL_ROM_TITLE_NAME_BUILD_STRATEGIES from "../../../constants/roms/all-rom-title-name-build-strategies.constant.js";
import type { RomTitleNameBuildStrategy } from "../../../types/roms/rom-title-name-build-strategy.type.js";

const isRomTitleNameBuildStrategy = (
  s: string,
): s is RomTitleNameBuildStrategy =>
  ALL_ROM_TITLE_NAME_BUILD_STRATEGIES.includes(s as RomTitleNameBuildStrategy);

export default isRomTitleNameBuildStrategy;
