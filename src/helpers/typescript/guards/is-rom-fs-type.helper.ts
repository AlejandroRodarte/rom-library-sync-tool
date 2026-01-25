import ROM_FS_TYPES from "../../../constants/rom-fs-types.constant.js";
import type { RomFsType } from "../../../types/rom-fs-type.type.js";

const isRomFsType = (s: string): s is RomFsType =>
  ROM_FS_TYPES.includes(s as RomFsType);

export default isRomFsType;
