import type { Rom } from "../types.js";

const discardRomsBasedOnUnwantedLabelSegments = (
  roms: Rom[],
  unwantedLabelSegments: string[],
): void => {
  let romAmount = roms.length;
  if (romAmount === 1) return;

  for (const rom of roms) {
    if (romAmount === 1) break;

    let romHasUnwantedLabelSegment = false;

    for (const unwantedLabelSegment of unwantedLabelSegments) {
      romHasUnwantedLabelSegment = rom.labels.some((label) =>
        label.includes(unwantedLabelSegment),
      );
      if (romHasUnwantedLabelSegment) break;
    }

    if (romHasUnwantedLabelSegment) {
      rom.selected = false;
      romAmount--;
    }
  }
};

export default discardRomsBasedOnUnwantedLabelSegments;
