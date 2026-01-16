import type { ContentTargetName } from "../../../types/content-target-name.type.js";
import isContentTargetName from "./is-content-target-name.helper.js";

const isSyncTargetList = (list: string[]): list is ContentTargetName[] =>
  list.every((i) => isContentTargetName(i));

export default isSyncTargetList;
