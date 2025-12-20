import type { Rom } from "./types.js";

const unselectByCountry = (
  roms: Rom[],
  country: string,
  shortCircuit = false,
): boolean => {
  // short-circuit operation (for example, when a label for another country has already been found before the current one)
  if (shortCircuit) return shortCircuit;

  let groupHasCountryLabel = false;

  // if country label is found in any of the ROMs, short-circuit
  for (const rom of roms) {
    for (const label of rom.labels) {
      if (label.includes(country)) {
        groupHasCountryLabel = true;
        break;
      }
    }
    if (groupHasCountryLabel) break;
  }

  // country label found: unselect all ROMs in group that do NOT have it
  if (groupHasCountryLabel) {
    for (const rom of roms) {
      if (!rom.selected) continue;
      let romHasCountryLabel = false;
      for (const label of rom.labels) {
        if (label.includes(country)) {
          romHasCountryLabel = true;
          break;
        }
      }
      if (!romHasCountryLabel) rom.selected = false;
    }
  }

  // report back if country label was found in ROM group
  return groupHasCountryLabel;
};

export default unselectByCountry;
