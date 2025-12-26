import {
  BETA_LABEL_SEGMENT,
  DEMO_LABEL_SEGMENT,
  DISK_LABEL_SEGMENT,
  PROTO_LABEL_SEGMENT,
  SAMPLE_LABEL_SEGMENT,
  VIRTUAL_CONSOLE_LABEL_SEGMENT,
} from "../constants/label-segments.constants.js";
import type { Rom } from "../types.js";
import getSpecialFlagsFromRomSet from "./get-special-flags-from-rom-set.helper.js";

const discardRomsBasedOnUnwantedLabelSegments = (roms: Rom[]): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === 1) return;

  let specialFlags = getSpecialFlagsFromRomSet(selectedRoms);
  const unwantedLabelSegments: string[] = [];

  if (!specialFlags.allRomsAreSample)
    unwantedLabelSegments.push(SAMPLE_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreDemo)
    unwantedLabelSegments.push(DEMO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreProto)
    unwantedLabelSegments.push(PROTO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreBeta)
    unwantedLabelSegments.push(BETA_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreForVirtualConsole)
    unwantedLabelSegments.push(VIRTUAL_CONSOLE_LABEL_SEGMENT);

  unwantedLabelSegments.push(DISK_LABEL_SEGMENT);

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
