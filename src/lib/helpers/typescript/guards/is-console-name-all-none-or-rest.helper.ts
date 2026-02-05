import CONSOLE_NAMES_ALL_NONE_AND_REST from "../../../constants/consoles/console-names-all-none-and-rest.constant.js";
import type { ConsoleNameAllNoneOrRest } from "../../../types/consoles/console-name-all-none-or-rest.type.js";

const isConsoleNameAllNoneOrRest = (s: string): s is ConsoleNameAllNoneOrRest =>
  CONSOLE_NAMES_ALL_NONE_AND_REST.includes(s as ConsoleNameAllNoneOrRest);

export default isConsoleNameAllNoneOrRest;
