import type { Rom } from "../types.js";

const pickRomWithLeastAmountOfLabels = (
  roms: Rom[],
  countryLabel: string,
): void => {
  const countryRomsSelected = roms.filter((rom) => {
    const hasCountryLabel = rom.labels.some((label) => label === countryLabel);
    const isSelected = rom.selected;
    return hasCountryLabel && isSelected;
  });

  if (countryRomsSelected.length > 1) {
    let minLabelAmount = -1;
    const firstRom = countryRomsSelected[0];
    if (firstRom) minLabelAmount = firstRom.labels.length;

    for (let index = 1; index < countryRomsSelected.length; index++) {
      const rom = countryRomsSelected[index];
      if (rom) {
        const labelAmount = rom.labels.length;
        if (labelAmount < minLabelAmount) minLabelAmount = labelAmount;
      }
    }

    countryRomsSelected.forEach((rom) => {
      if (rom.labels.length > minLabelAmount) rom.selected = false;
    });
  }
};

export default pickRomWithLeastAmountOfLabels;
