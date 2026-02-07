import ALL_ROM_LANGUAGES_SET from "../../../constants/roms/all-rom-languages-set.constant.js";
import type { RomLanguage } from "../../../types/roms/rom-language.type.js";

const isRomLanguage = (s: string): s is RomLanguage =>
  ALL_ROM_LANGUAGES_SET.has(s);

export default isRomLanguage;
