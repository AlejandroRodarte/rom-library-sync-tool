import WHITELISTED_LABELS_BASE_PRIORITY_LIST from "../../constants/whitelisted-labels-base-priority-list.constant.js";
import type { Rom } from "../../types.js";
import byWhitelistedLabels from "./by-whitelisted-labels.helper.js";

const byWhitelistedLabelsBasePriorityList = (roms: Rom[]): void =>
  byWhitelistedLabels(roms, WHITELISTED_LABELS_BASE_PRIORITY_LIST);

export default byWhitelistedLabelsBasePriorityList;
