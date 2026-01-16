import type { ContentTargetsListItem } from "../../../types/content-targets-list-item.type.js";
import isContentTargetName from "./is-content-target-name.helper.js";

const isContentTargetsListItem = (s: string): s is ContentTargetsListItem =>
  isContentTargetName(s) || s === "none" || s === "all";

export default isContentTargetsListItem;
