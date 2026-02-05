import ALL_MODE_NAMES from "../../../constants/modes/all-mode-names.constant.js";
import type { ModeName } from "../../../types/modes/mode-name.type.js";

const isModeName = (m: string): m is ModeName =>
  ALL_MODE_NAMES.includes(m as ModeName);

export default isModeName;
