import UNRELEASED_LABEL_SEGMENT_LIST from "../constants/unreleased-label-segment-list.constant.js";
import VIRTUAL_CONSOLE_LABEL_SEGMENT from "../constants/virtual-console-label-segment.constant.js";
import type { Rom, SpecialFlags } from "../types.js";

const getSpecialFlagsFromRomSet = (roms: Rom[]): SpecialFlags => {
  const allRomsAreUnreleased = roms.every((rom) =>
    rom.labels.some((label) => {
      for (const unwantedLabelSegment of UNRELEASED_LABEL_SEGMENT_LIST) {
        if (label.includes(unwantedLabelSegment)) return true;
      }
      return false;
    }),
  );

  const allRomsAreForVirtualConsole = roms.every((rom) =>
    rom.labels.some((label) => label.includes(VIRTUAL_CONSOLE_LABEL_SEGMENT)),
  );

  return { allRomsAreUnreleased, allRomsAreForVirtualConsole };
};

export default getSpecialFlagsFromRomSet;
