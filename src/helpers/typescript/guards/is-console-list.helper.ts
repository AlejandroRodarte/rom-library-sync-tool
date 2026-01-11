import type { ConsoleName } from "../../../types/console-name.type.js";
import isConsoleName from "./is-console-name.helper.js";

const isConsoleList = (consoleList: string[]): consoleList is ConsoleName[] =>
  consoleList.every((consoleName) => isConsoleName(consoleName));

export default isConsoleList;
