import {
  BETA_LABEL_SEGMENT,
  DEMO_LABEL_SEGMENT,
  PROTO_LABEL_SEGMENT,
  SAMPLE_LABEL_SEGMENT,
  VIRTUAL_CONSOLE_LABEL_SEGMENT,
} from "../constants/label-segments.constants.js";
import type { Rom } from "../types.js";
import getSpecialFlagsFromRomSet from "./get-special-flags-from-rom-set.helper.js";
import unselectByBannedLabelSegments from "./unselect-by-banned-label-segments.helper.js";

const unselectBySpecialFlags = (roms: Rom[], keepSelected = 1): void => {
  let selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === keepSelected) return;

  let specialFlags = getSpecialFlagsFromRomSet(selectedRoms);
  const bannedLabelSegments: string[] = [];

  if (!specialFlags.allRomsAreSample)
    bannedLabelSegments.push(SAMPLE_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreDemo)
    bannedLabelSegments.push(DEMO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreProto)
    bannedLabelSegments.push(PROTO_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreBeta)
    bannedLabelSegments.push(BETA_LABEL_SEGMENT);
  if (!specialFlags.allRomsAreForVirtualConsole)
    bannedLabelSegments.push(VIRTUAL_CONSOLE_LABEL_SEGMENT);

  unselectByBannedLabelSegments(
    selectedRoms,
    bannedLabelSegments,
    keepSelected,
  );
};

export default unselectBySpecialFlags;
