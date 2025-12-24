import type { Rom } from "../types.js";

const discardRomsBasedOnUnwantedExactLabels = (
  roms: Rom[],
  unwantedExactLabels: string[],
): void => {
  let romAmount = roms.length;
  if (romAmount === 1) return;

  for (const unwantedExactLabel of unwantedExactLabels) {
    const romsWithUnwantedLabel = roms.filter((rom) =>
      rom.labels.includes(unwantedExactLabel),
    );

    const allRomsHaveUnwantedLabel =
      romsWithUnwantedLabel.length === roms.length;
    if (allRomsHaveUnwantedLabel) continue;

    for (const romToDeselect of romsWithUnwantedLabel) {
      romToDeselect.selected = false;
      romAmount--;
      if (romAmount === 1) return;
    }
  }
};

export default discardRomsBasedOnUnwantedExactLabels;
