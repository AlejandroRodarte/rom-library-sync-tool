import UNRELEASED_LABELS from "../constants/unreleased-labels.constant.js";
import VIRTUAL_CONSOLE_LABEL from "../constants/virtual-console-label.constant.js";
import type { Rom, SpecialFlags } from "../types.js";

interface CountryAndRoms {
  country: string;
  roms: Rom[];
}

const discardRomsBasedOnCountryList = (
  roms: Rom[],
  countryList: string[],
  specialFlags: SpecialFlags,
): CountryAndRoms => {
  let countryFound = "";

  for (const country of countryList) {
    const countryRoms = roms.filter((rom) => rom.labels.includes(country));
    if (countryRoms.length === 0) continue;
    countryFound = country;

    if (
      !specialFlags.allRomsAreUnreleased &&
      !specialFlags.allRomsAreForVirtualConsole
    ) {
      const releasedCountryRoms = countryRoms.filter(
        (rom) =>
          !rom.labels.some((label) => {
            for (const unwantedLabel of UNRELEASED_LABELS) {
              if (label.includes(unwantedLabel)) return true;
            }
            return false;
          }),
      );

      const allCountryRomsAreUnreleased = releasedCountryRoms.length === 0;
      if (allCountryRomsAreUnreleased) continue;

      const allReleasedCountryRomsAreForVirtualConsole =
        releasedCountryRoms.every((rom) =>
          rom.labels.some((label) => label.includes(VIRTUAL_CONSOLE_LABEL)),
        );
      if (allReleasedCountryRomsAreForVirtualConsole) continue;
    }

    const nonCountryRoms = roms.filter((rom) => !rom.labels.includes(country));
    nonCountryRoms.forEach((rom) => (rom.selected = false));

    if (countryFound) return { country: countryFound, roms: countryRoms };
  }

  return { country: "", roms: [] };
};

export default discardRomsBasedOnCountryList;
