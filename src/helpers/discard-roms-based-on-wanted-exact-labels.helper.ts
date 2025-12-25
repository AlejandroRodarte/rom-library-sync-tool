import WANTED_EXACT_LABELS_BASE_LIST from "../constants/wanted-exact-labels-base-list.constant.js";
import type { Rom } from "../types.js";

const discardRomsBasedOnWantedExactLabels = (roms: Rom[]): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === 1) return;

  for (const wantedExactLabel of WANTED_EXACT_LABELS_BASE_LIST) {
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

export default discardRomsBasedOnWantedExactLabels;
