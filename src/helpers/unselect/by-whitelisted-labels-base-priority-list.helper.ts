import type Title from "../../classes/title.class.js";
import WHITELISTED_LABELS_BASE_PRIORITY_LIST from "../../constants/whitelisted-labels-base-priority-list.constant.js";
import byWhitelistedLabels from "./by-whitelisted-labels.helper.js";

const byWhitelistedLabelsBasePriorityList = (title: Title): void => {
  if (!title.canUnselect()) return;
  byWhitelistedLabels(title, WHITELISTED_LABELS_BASE_PRIORITY_LIST);
};

export default byWhitelistedLabelsBasePriorityList;
