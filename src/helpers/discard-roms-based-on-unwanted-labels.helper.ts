import type { Rom, UnwantedLabels } from "../types.js";

const discardRomsBasedOnUnwantedLabels = (
  roms: Rom[],
  unwantedLabels: UnwantedLabels,
): void => {
  for (const rom of roms) {
    let romHasUnwantedLabel = false;

    for (const unwantedIncludesLabel of unwantedLabels.includes) {
      romHasUnwantedLabel = rom.labels.some((label) =>
        label.includes(unwantedIncludesLabel),
      );
      if (romHasUnwantedLabel) break;
    }

    if (romHasUnwantedLabel) {
      rom.selected = false;
      continue;
    }

    for (const unwantedExactLabel of unwantedLabels.exact) {
      romHasUnwantedLabel = rom.labels.includes(unwantedExactLabel);
      if (romHasUnwantedLabel) break;
    }

    if (romHasUnwantedLabel) rom.selected = false;
  }
};

export default discardRomsBasedOnUnwantedLabels;
