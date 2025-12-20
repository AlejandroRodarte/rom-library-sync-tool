import type { Rom } from "./types.js";

const unselectByUnwanted = (roms: Rom[], unwantedLabels: string[]): void => {
  if (unwantedLabels.length === 0) return;

  for (const unwantedLabel of unwantedLabels) {
    for (const rom of roms) {
      if (!rom.selected) continue;
      let romHasUnwantedLabel = false;
      for (const label of rom.labels) {
        if (label.includes(unwantedLabel)) {
          romHasUnwantedLabel = true;
          break;
        }
      }
      if (romHasUnwantedLabel) rom.selected = false;
    }
  }
};

export default unselectByUnwanted;
