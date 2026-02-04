import ALL_CONSOLE_NAMES from "../../../constants/all-console-names.constant.js";
import type { ConsoleName } from "../../../types/console-name.type.js";

const isConsoleName = (consoleName: string): consoleName is ConsoleName =>
  ALL_CONSOLE_NAMES.includes(consoleName as ConsoleName);

export default isConsoleName;
