import ALL_ROM_FS_TYPES from "../../../constants/roms/all-rom-fs-types.constant.js";
import type { RomFsType } from "../../../types/roms/rom-fs-type.type.js";

const isRomFsType = (s: string): s is RomFsType =>
  ALL_ROM_FS_TYPES.includes(s as RomFsType);

export default isRomFsType;
