import type { Rom, RomIndexAndVersion, VersionSystem } from "../types.js";

const selectRomsBasedOnVersioningSystems = (
  roms: Rom[],
  versionSystems: VersionSystem[],
  countryLabel: string,
): void => {
  for (const versionSystem of versionSystems) {
    const countryVersionedRoms: RomIndexAndVersion[] = [];

    roms.forEach((rom, index) => {
      const hasCountryLabel = rom.labels.includes(countryLabel);
      const versionLabelIndex = rom.labels.findIndex((label) =>
        label.match(versionSystem.pattern),
      );

      if (hasCountryLabel && versionLabelIndex !== -1) {
        const version = rom.labels[versionLabelIndex];
        if (version) countryVersionedRoms.push({ index, version });
      }
    });

    const countryVersionedRomsWereFound = countryVersionedRoms.length > 0;

    const highestVersionedRom: RomIndexAndVersion = {
      index: -1,
      version: "",
    };

    let firstVersion = true;
    for (const rom of countryVersionedRoms) {
      if (firstVersion) {
        highestVersionedRom.index = rom.index;
        highestVersionedRom.version = rom.version;
        firstVersion = false;
        continue;
      }

      const result = versionSystem.compareFn(
        rom.version,
        highestVersionedRom.version,
      );
      const newHighestVersionFound = result === 1;

      if (newHighestVersionFound) {
        highestVersionedRom.index = rom.index;
        highestVersionedRom.version = rom.version;
      }
    }

    const romToSelect = roms[highestVersionedRom.index];
    if (romToSelect) romToSelect.selected = true;

    countryVersionedRoms.forEach((rom) => {
      if (rom.index !== highestVersionedRom.index) {
        const romToDeselect = roms[rom.index];
        if (romToDeselect) romToDeselect.selected = false;
      }
    });

    if (countryVersionedRomsWereFound) {
      const countryNonVersionedRoms = roms.filter((rom) => {
        const hasCountryLabel = rom.labels.includes(countryLabel);
        const lacksVersionLabel = !rom.labels.some((label) =>
          label.match(versionSystem.pattern),
        );
        return hasCountryLabel && lacksVersionLabel;
      });

      countryNonVersionedRoms.forEach((rom) => (rom.selected = false));
    }

    if (countryVersionedRomsWereFound) break;
  }
};

export default selectRomsBasedOnVersioningSystems;
