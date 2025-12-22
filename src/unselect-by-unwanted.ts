import type { Rom } from "./types.js";

const unselectByUnwanted = (
  roms: Rom[],
  unwantedLabels: string[],
  countryLabel: string,
): void => {
  if (unwantedLabels.length === 0) return;

  const selectedCountryRoms = roms.filter((rom) => {
    const isSelected = rom.selected;
    const hasCountryLabel = rom.labels.some((label) =>
      label.includes(countryLabel),
    );
    return isSelected && hasCountryLabel;
  });

  for (const rom of selectedCountryRoms) {
    for (const unwantedLabel of unwantedLabels) {
      const romHasUnwantedLabel = rom.labels.some((label) =>
        label.includes(unwantedLabel),
      );
      if (romHasUnwantedLabel) {
        rom.selected = false;
        break;
      }
    }
  }
};

export default unselectByUnwanted;
