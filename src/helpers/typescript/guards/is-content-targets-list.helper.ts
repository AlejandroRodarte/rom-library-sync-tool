import type { ContentTargetsList } from "../../../types/content-targets-list.type.js";
import isContentTargetsListItem from "./is-content-targets-list-item.helper.js";

const isContentTargetsList = (list: string[]): list is ContentTargetsList =>
  list.every((i) => isContentTargetsListItem(i));

export default isContentTargetsList;
