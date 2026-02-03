import type { RawModeConsolesMediaNames } from "../../../types/raw-mode-consoles-media-names.type.js";
import isConsoleNameAllNoneOrRestList from "./is-console-name-all-none-or-rest-list.helper.js";

const isRawModeConsolesMediaNames = (o: {
  [key: string]: string | string[];
}): o is RawModeConsolesMediaNames => {
  const keys = Object.keys(o);
  return isConsoleNameAllNoneOrRestList(keys);
};

export default isRawModeConsolesMediaNames;
