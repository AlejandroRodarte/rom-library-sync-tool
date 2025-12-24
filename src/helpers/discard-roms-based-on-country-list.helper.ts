import UNRELEASED_LABEL_SEGMENT_LIST from "../constants/unreleased-label-segment-list.constant.js";
import VIRTUAL_CONSOLE_LABEL_SEGMENT from "../constants/virtual-console-label-segment.constant.js";
import type { Rom } from "../types.js";
import getSpecialFlagsFromRomSet from "./get-special-flags-from-rom-set.helper.js";

const discardRomsBasedOnCountryList = (
  roms: Rom[],
  countryList: string[],
): string => {
  const unselectNonCountryRoms = (country: string) => {
    const nonCountryRoms = roms.filter((rom) => !rom.labels.includes(country));
    nonCountryRoms.forEach((rom) => (rom.selected = false));
  };

  const specialFlags = getSpecialFlagsFromRomSet(roms);

  for (const country of countryList) {
    const countryRoms = roms.filter((rom) => rom.labels.includes(country));
    const countryRomsFound = countryRoms.length > 0;
    if (!countryRomsFound) continue;

    if (
      specialFlags.allRomsAreUnreleased ||
      specialFlags.allRomsAreForVirtualConsole
    ) {
      unselectNonCountryRoms(country);
      return country;
    }

    const releasedCountryRoms = countryRoms.filter(
      (rom) =>
        !rom.labels.some((label) => {
          for (const unwantedLabelSegment of UNRELEASED_LABEL_SEGMENT_LIST) {
            if (label.includes(unwantedLabelSegment)) return true;
          }
          return false;
        }),
    );

    const allCountryRomsAreUnreleased = releasedCountryRoms.length === 0;
    if (allCountryRomsAreUnreleased) continue;

    const allReleasedCountryRomsAreForVirtualConsole =
      releasedCountryRoms.every((rom) =>
        rom.labels.some((label) =>
          label.includes(VIRTUAL_CONSOLE_LABEL_SEGMENT),
        ),
      );
    if (allReleasedCountryRomsAreForVirtualConsole) continue;

    unselectNonCountryRoms(country);
    return country;
  }

  return "";
};

export default discardRomsBasedOnCountryList;
