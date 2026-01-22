import type { ConsolesListItemOrRest } from "../../../types/consoles-list-item-or-rest.type.js";
import isConsolesListItem from "./is-consoles-list-item.helper.js";

const isConsolesListItemOrRest = (s: string): s is ConsolesListItemOrRest =>
  isConsolesListItem(s) || s === "rest";

export default isConsolesListItemOrRest;
