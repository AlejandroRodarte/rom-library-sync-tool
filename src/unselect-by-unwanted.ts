import type { Rom } from "./types.js";

const unselectByUnwanted = (roms: Rom[], unwantedLabels: string[]): void => {
  if (unwantedLabels.length === 0) return;
  for (const unwantedLabel of unwantedLabels) {
    const unwantedRoms = roms.filter((rom) => rom.labels.some((label) => label.includes(unwantedLabel)));
    unwantedRoms.forEach((rom) => rom.selected = false);
  }
};

export default unselectByUnwanted;
