import CONSOLE_NAMES from "../../../constants/console-names.constant.js";
import type { ConsoleName } from "../../../types/console-name.type.js";

const isConsoleName = (consoleName: string): consoleName is ConsoleName =>
  CONSOLE_NAMES.includes(consoleName as ConsoleName);

export default isConsoleName;
