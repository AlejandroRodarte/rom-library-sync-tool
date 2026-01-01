import BANNED_LABELS_BASE_PRIORITY_LIST from "../../constants/banned-labels-base-priority-list.constant.js";
import type { Rom } from "../../types.js";
import unselectByBannedLabels from "./unselect-by-banned-labels.helper.js";

const unselectByBannedLabelsBasePriorityList = (
  roms: Rom[],
  keepSelected = 1,
): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  unselectByBannedLabels(selectedRoms, BANNED_LABELS_BASE_PRIORITY_LIST);
};

export default unselectByBannedLabelsBasePriorityList;
