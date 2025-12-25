import UNWANTED_EXACT_LABELS_BASE_LIST from "../constants/unwanted-exact-labels-base-list.constant.js";
import type { Rom } from "../types.js";

const discardRomsBasedOnUnwantedExactLabels = (roms: Rom[]): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === 1) return;

  const unwantedExactLabels = [...UNWANTED_EXACT_LABELS_BASE_LIST];

  for (const unwantedExactLabel of unwantedExactLabels) {
    const romsWithUnwantedLabel = selectedRoms.filter((rom) =>
      rom.labels.includes(unwantedExactLabel),
    );

    const allRomsHaveUnwantedLabel =
      romsWithUnwantedLabel.length === selectedRoms.length;
    if (allRomsHaveUnwantedLabel) continue;

    for (const romToDeselect of romsWithUnwantedLabel) {
      romToDeselect.selected = false;
      romAmount--;
      if (romAmount === 1) return;
      selectedRoms = roms.filter((rom) => rom.selected);
    }
  }
};

export default discardRomsBasedOnUnwantedExactLabels;
