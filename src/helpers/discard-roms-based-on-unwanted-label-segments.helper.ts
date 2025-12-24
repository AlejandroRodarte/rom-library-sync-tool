import type { Rom } from "../types.js";

const discardRomsBasedOnUnwantedLabelSegments = (
  roms: Rom[],
  unwantedLabelSegments: string[],
): void => {
  let romAmount = roms.length;
  if (romAmount === 1) return;

  for (const unwantedLabelSegment of unwantedLabelSegments) {
    const romsWithUnwantedLabelSegment = roms.filter((rom) =>
      rom.labels.some((label) => label.includes(unwantedLabelSegment)),
    );

    for (const romToDeselect of romsWithUnwantedLabelSegment) {
      romToDeselect.selected = false;
      romAmount--;
      if (romAmount === 1) return;
    }
  }
};

export default discardRomsBasedOnUnwantedLabelSegments;
