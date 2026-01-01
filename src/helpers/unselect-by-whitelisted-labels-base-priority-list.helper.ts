import WHITELISTED_LABELS_BASE_PRIORITY_LIST from "../constants/whitelisted-labels-base-priority-list.constant.js";
import type { Rom } from "../types.js";

const unselectByWhitelistedLabelsBasePriorityList = (roms: Rom[]): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === 1) return;

  for (const wantedExactLabel of WHITELISTED_LABELS_BASE_PRIORITY_LIST) {
    const romsWithoutWantedLabel = selectedRoms.filter(
      (rom) => !rom.labels.includes(wantedExactLabel),
    );

    const romSetLacksWantedLabel =
      romsWithoutWantedLabel.length === selectedRoms.length;
    if (romSetLacksWantedLabel) continue;

    for (const romToUnselect of romsWithoutWantedLabel) {
      romToUnselect.selected = false;
      romAmount--;
      if (romAmount === 1) return;
      selectedRoms = roms.filter((rom) => rom.selected);
    }
  }
};

export default unselectByWhitelistedLabelsBasePriorityList;
