import type { Rom } from "./types.js";

const unselectByCountry = (
  roms: Rom[],
  country: string,
): [boolean, string] => {
  const countryLabelFound = roms.some((rom) => rom.labels.some((label) => label.includes(country)));
  if (!countryLabelFound) return [false, ""];

  const nonCountryRoms = roms.filter((rom) => !rom.labels.some((label) => label.includes(country)));
  nonCountryRoms.forEach((rom) => rom.selected = false);
  return [true, country];
};

export default unselectByCountry;
