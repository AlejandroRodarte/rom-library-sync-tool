import UNRELEASED_LABELS from "../constants/unreleased-labels.constant.js";
import VIRTUAL_CONSOLE_LABEL from "../constants/virtual-console-label.constant.js";
import type { Rom, SpecialFlags } from "../types.js";

const getSpecialFlagsFromRomSet = (roms: Rom[]): SpecialFlags => {
  const allRomsAreUnreleased = roms.every((rom) =>
    rom.labels.some((label) => {
      for (const unwantedLabel of UNRELEASED_LABELS) {
        if (label.includes(unwantedLabel)) return true;
      }
      return false;
    }),
  );

  const allRomsAreForVirtualConsole = roms.every((rom) =>
    rom.labels.some((label) => label.includes(VIRTUAL_CONSOLE_LABEL)),
  );

  return { allRomsAreUnreleased, allRomsAreForVirtualConsole };
};

export default getSpecialFlagsFromRomSet;
