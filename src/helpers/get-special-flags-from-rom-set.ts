import type { Rom } from "../types.js";

interface SpecialFlags {
  allRomsAreUnreleased: boolean;
  allRomsAreForVirtualConsole: boolean;
}

const getSpecialFlagsFromRomSet = (roms: Rom[]): SpecialFlags => {
  const allRomsAreUnreleased = roms.every((rom) =>
    rom.labels.some(
      (label) =>
        label.includes("Beta") ||
        label.includes("Proto") ||
        label.includes("Demo"),
    ),
  );
  const allRomsAreForVirtualConsole = roms.every((rom) =>
    rom.labels.some((label) => label.includes("Virtual Console")),
  );

  return { allRomsAreUnreleased, allRomsAreForVirtualConsole };
};

export default getSpecialFlagsFromRomSet;
