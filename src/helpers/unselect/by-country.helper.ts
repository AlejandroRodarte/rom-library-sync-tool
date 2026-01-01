import { VIRTUAL_CONSOLE_LABEL_SEGMENT } from "../../constants/label-segments.constants.js";
import UNRELEASED_LABEL_SEGMENT_LIST from "../../constants/unreleased-label-segment-list.constant.js";
import type { Rom } from "../../types.js";
import getSpecialFlagsFromRomSet from "../get-special-flags-from-rom-set.helper.js";

const unselectByCountry = (
  roms: Rom[],
  countryPriorityList: string[],
  keepSelected: number = 1,
): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);
  let selectedRomAmount = selectedRoms.length;

  if (keepSelected > selectedRomAmount) {
    console.log(
      `You want to keep selected ${keepSelected} ROMs out of the ${selectedRomAmount} selected ROMs available.`,
    );
    return;
  }

  if (selectedRomAmount === keepSelected) return;

  const specialFlags = getSpecialFlagsFromRomSet(selectedRoms);

  const unselectNonCountryRoms = (country: string): void => {
    const nonCountryRoms = selectedRoms.filter(
      (rom) => !rom.labels.includes(country),
    );
    for (const romToUnselect of nonCountryRoms) {
      romToUnselect.selected = false;
      selectedRomAmount--;
      if (selectedRomAmount === keepSelected) return;
    }
  };

  for (const country of countryPriorityList) {
    const countryRoms = selectedRoms.filter((rom) =>
      rom.labels.includes(country),
    );
    const countryRomsFound = countryRoms.length > 0;
    if (!countryRomsFound) continue;

    if (
      specialFlags.allRomsAreUnreleased ||
      specialFlags.allRomsAreForVirtualConsole
    ) {
      unselectNonCountryRoms(country);
      return;
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
    return;
  }
};

export default unselectByCountry;
