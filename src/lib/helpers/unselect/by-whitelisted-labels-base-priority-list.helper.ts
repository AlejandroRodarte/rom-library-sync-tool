import type Title from "../../classes/entities/title.class.js";
import WHITELISTED_LABELS_BASE_PRIORITY_LIST from "../../objects/classes/devices/generic-device/whitelisted-labels-base-priority-list.constant.js";
import byWhitelistedLabels from "./by-whitelisted-labels.helper.js";

const byWhitelistedLabelsBasePriorityList = (title: Title): void => {
  if (!title.canUnselect()) return;
  byWhitelistedLabels(title, WHITELISTED_LABELS_BASE_PRIORITY_LIST);
};

export default byWhitelistedLabelsBasePriorityList;
