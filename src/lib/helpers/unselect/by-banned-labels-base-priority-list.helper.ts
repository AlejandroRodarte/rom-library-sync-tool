import type Title from "../../classes/entities/title.class.js";
import BANNED_LABELS_BASE_PRIORITY_LIST from "../../objects/classes/devices/generic-device/banned-labels-base-priority-list.constant.js";
import byBannedLabels from "./by-banned-labels.helper.js";

const byBannedLabelsBasePriorityList = (title: Title): void => {
  if (!title.canUnselect()) return;
  byBannedLabels(title, BANNED_LABELS_BASE_PRIORITY_LIST);
};

export default byBannedLabelsBasePriorityList;
