import type { Rom } from "./types.js";

const unselectByCountry = (
  roms: Rom[],
  country: string,
  shortCircuit = false,
): boolean => {
  // short-circuit operation (for example, when a label for another country has already been found before the current one)
  if (shortCircuit) return shortCircuit;

  const countryLabelFound = roms.some((rom) => rom.labels.some((label) => label.includes(country)));
  if (!countryLabelFound) return countryLabelFound;

  const nonCountryRoms = roms.filter((rom) => !rom.labels.some((label) => label.includes(country)));
  nonCountryRoms.forEach((rom) => rom.selected = false);
  return true;
};

export default unselectByCountry;
