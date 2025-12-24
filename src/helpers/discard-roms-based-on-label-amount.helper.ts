import type { Rom } from "../types.js";

const discardRomsBasedOnLabelAmount = (roms: Rom[]): void => {
  if (roms.length > 1) {
    let minLabelAmount = -1;
    const firstRom = roms[0];
    if (firstRom) minLabelAmount = firstRom.labels.length;

    for (let index = 1; index < roms.length; index++) {
      const rom = roms[index];
      if (rom) {
        const labelAmount = rom.labels.length;
        if (labelAmount < minLabelAmount) minLabelAmount = labelAmount;
      }
    }

    roms.forEach((rom) => {
      if (rom.labels.length > minLabelAmount) rom.selected = false;
    });
  }
};

export default discardRomsBasedOnLabelAmount;
