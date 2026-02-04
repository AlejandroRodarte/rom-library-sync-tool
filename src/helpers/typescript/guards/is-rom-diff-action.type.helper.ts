import ALL_ROM_DIFF_ACTION_TYPES from "../../../constants/all-rom-diff-action-types.constant.js";
import type { RomDiffActionType } from "../../../types/rom-diff-action-type.type.js";

const isRomDiffActionType = (s: string): s is RomDiffActionType =>
  ALL_ROM_DIFF_ACTION_TYPES.includes(s as RomDiffActionType);

export default isRomDiffActionType;
