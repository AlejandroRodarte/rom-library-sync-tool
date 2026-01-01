import WHITELISTED_LABELS_BASE_PRIORITY_LIST from "../../constants/whitelisted-labels-base-priority-list.constant.js";
import type { Rom } from "../../types.js";
import unselectByWhitelistedLabels from "./unselect-by-whitelisted-labels.helper.js";

const unselectByWhitelistedLabelsBasePriorityList = (roms: Rom[]): void =>
  unselectByWhitelistedLabels(roms, WHITELISTED_LABELS_BASE_PRIORITY_LIST);

export default unselectByWhitelistedLabelsBasePriorityList;
