import type { ConsolesListItem } from "../../../types/consoles-list-item.type.js";
import isConsoleName from "./is-console-name.helper.js";

const isConsolesListItem = (item: string): item is ConsolesListItem =>
  isConsoleName(item) || item === "none" || item === "all";

export default isConsolesListItem;
