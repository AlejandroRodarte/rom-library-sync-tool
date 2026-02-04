import CONSOLE_NAME_ALL_NONE_AND_REST from "../../../constants/console-name-all-none-and-rest.constant.js";
import type { ConsoleNameAllNoneOrRest } from "../../../types/console-name-all-none-or-rest.type.js";

const isConsoleNameAllNoneOrRest = (s: string): s is ConsoleNameAllNoneOrRest =>
  CONSOLE_NAME_ALL_NONE_AND_REST.includes(s as ConsoleNameAllNoneOrRest);

export default isConsoleNameAllNoneOrRest;
