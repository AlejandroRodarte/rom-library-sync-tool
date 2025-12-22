import UNRELEASED_LABELS from "../constants/unreleased-labels.constant.js";
import type { Rom } from "../types.js";

interface SpecialFlags {
  allRomsAreUnreleased: boolean;
  allRomsAreForVirtualConsole: boolean;
}

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
    rom.labels.some((label) => label.includes("Virtual Console")),
  );

  return { allRomsAreUnreleased, allRomsAreForVirtualConsole };
};

export default getSpecialFlagsFromRomSet;
