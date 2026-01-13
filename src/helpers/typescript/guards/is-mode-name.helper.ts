import MODE_NAMES from "../../../constants/mode-names.constant.js";
import type { ModeName } from "../../../types/mode-name.type.js";

const isModeName = (m: string): m is ModeName =>
  MODE_NAMES.includes(m as ModeName);

export default isModeName;
