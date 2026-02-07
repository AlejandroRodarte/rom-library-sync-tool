import type Title from "../../../../../../classes/entities/title.class.js";
import { VIRTUAL_CONSOLE_LABEL_SEGMENT } from "../../../../../../constants/roms/rom-label-segments.constants.js";
import UNRELEASED_ROM_LABEL_SEGMENTS from "../../../../../../constants/roms/unreleased-rom-label-segments.constant.js";
import type { RomCountry } from "../../../../../../types/roms/rom-country.type.js";

const unselectManyByCountryPriorityList = (
  title: Title,
  countryPriorityList: RomCountry[],
): void => {
  if (!title.canUnselect()) return;
  const specialFlags = title.getSpecialFlags("selected");

  const unselectNonCountryRoms = (country: string): void => {
    const nonCountryRomIds = title.selectedRoms.entries
      .filter(([_, rom]) => !rom.labels.includes(country))
      .map(([id]) => id)
      .toArray();

    title.unselectMany(nonCountryRomIds);
  };

  for (const country of countryPriorityList) {
    const countryRoms = title.selectedRoms.entries
      .map(([, rom]) => rom)
      .filter((rom) => rom.labels.includes(country))
      .toArray();
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
          for (const unwantedLabelSegment of UNRELEASED_ROM_LABEL_SEGMENTS) {
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

export default unselectManyByCountryPriorityList;
