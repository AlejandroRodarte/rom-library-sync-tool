import UNRELEASED_LABEL_SEGMENT_LIST from "../constants/unreleased-label-segment-list.constant.js";
import VIRTUAL_CONSOLE_LABEL_SEGMENT from "../constants/virtual-console-label-segment.constant.js";
import type { Rom } from "../types.js";
import getSpecialFlagsFromRomSet from "./get-special-flags-from-rom-set.helper.js";

const discardRomsBasedOnUnwantedLabelSegments = (roms: Rom[]): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === 1) return;

  let specialFlags = getSpecialFlagsFromRomSet(selectedRoms);
  const unwantedLabelSegments: string[] = [];
  if (!specialFlags.allRomsAreUnreleased)
    unwantedLabelSegments.push(...UNRELEASED_LABEL_SEGMENT_LIST);
  if (!specialFlags.allRomsAreForVirtualConsole)
    unwantedLabelSegments.push(VIRTUAL_CONSOLE_LABEL_SEGMENT);

  for (const unwantedLabelSegment of unwantedLabelSegments) {
    const romsWithUnwantedLabelSegment = selectedRoms.filter((rom) =>
      rom.labels.some((label) => label.includes(unwantedLabelSegment)),
    );

    for (const romToUnselect of romsWithUnwantedLabelSegment) {
      romToUnselect.selected = false;
      romAmount--;
      if (romAmount === 1) return;
      selectedRoms = roms.filter((rom) => rom.selected);
    }
  }
};

export default discardRomsBasedOnUnwantedLabelSegments;
