import type { ConsolesList } from "../../../types/consoles-list.type.js";
import isConsolesListItem from "./is-consoles-list-item.helper.js";

const isConsolesList = (list: string[]): list is ConsolesList =>
  list.every((item) => isConsolesListItem(item));

export default isConsolesList;
