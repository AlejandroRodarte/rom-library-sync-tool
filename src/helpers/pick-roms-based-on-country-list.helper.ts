import UNRELEASED_LABELS from "../constants/unreleased-labels.constant.js";
import VIRTUAL_CONSOLE_LABEL from "../constants/virtual-console-label.constant.js";
import type { Rom } from "../types.js";

const pickRomsBasedOnCountryList = (
  roms: Rom[],
  countryList: string[],
  allRomsAreUnreleased: boolean,
): string => {
  let countryFound = "";

  for (const country of countryList) {
    const countryRoms = roms.filter((rom) =>
      rom.labels.some((label) => label.includes(country)),
    );
    if (countryRoms.length === 0) continue;
    countryFound = country;

    if (!allRomsAreUnreleased) {
      const allCountryRomsHaveUnwantedLabels = countryRoms.every((rom) =>
        rom.labels.some((label) => {
          for (const unwantedLabel of [
            ...UNRELEASED_LABELS,
            VIRTUAL_CONSOLE_LABEL,
          ]) {
            if (label.includes(unwantedLabel)) return true;
          }
          return false;
        }),
      );

      if (allCountryRomsHaveUnwantedLabels) continue;
    }

    const nonCountryRoms = roms.filter(
      (rom) => !rom.labels.some((label) => label.includes(country)),
    );
    nonCountryRoms.forEach((rom) => (rom.selected = false));

    if (countryFound) break;
  }

  return countryFound;
};

export default pickRomsBasedOnCountryList;
