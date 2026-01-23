import ROM_FILE_TYPES from "../../../constants/rom-file-types.constant.js";
import type { RomFileType } from "../../../types/rom-file-type.type.js";

const isRomFileType = (s: string): s is RomFileType =>
  ROM_FILE_TYPES.includes(s as RomFileType);

export default isRomFileType;
