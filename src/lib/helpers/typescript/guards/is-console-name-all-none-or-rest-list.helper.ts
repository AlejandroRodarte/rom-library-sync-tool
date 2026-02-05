import type { ConsoleNameAllNoneOrRest } from "../../../types/consoles/console-name-all-none-or-rest.type.js";
import isConsoleNameAllNoneOrRest from "./is-console-name-all-none-or-rest.helper.js";

const isConsoleNameAllNoneOrRestList = (
  list: string[],
): list is ConsoleNameAllNoneOrRest[] =>
  list.every((item) => isConsoleNameAllNoneOrRest(item));

export default isConsoleNameAllNoneOrRestList;
