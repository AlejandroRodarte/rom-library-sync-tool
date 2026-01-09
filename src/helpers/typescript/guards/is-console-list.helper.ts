import type { ConsoleName } from "../../../types.js";
import typeGuards from "./index.js";

const isConsoleList = (consoleList: string[]): consoleList is ConsoleName[] =>
  consoleList.every((consoleName) => typeGuards.isConsoleName(consoleName));

export default isConsoleList;
