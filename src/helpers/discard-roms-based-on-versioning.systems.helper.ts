import type { Rom, RomIndexAndVersion, VersionSystem } from "../types.js";

const discardRomsBasedOnVersioningSystems = (
  roms: Rom[],
  versionSystems: VersionSystem[],
): void => {
  for (const versionSystem of versionSystems) {
    const versionedRoms: RomIndexAndVersion[] = [];

    roms.forEach((rom, index) => {
      const versionLabelIndex = rom.labels.findIndex((label) =>
        label.match(versionSystem.pattern),
      );

      if (versionLabelIndex !== -1) {
        const version = rom.labels[versionLabelIndex];
        if (version) versionedRoms.push({ index, version });
      }
    });

    const versionedRomsFound = versionedRoms.length > 0;
    if (!versionedRomsFound) continue;

    const highestVersionedRom: RomIndexAndVersion = {
      index: -1,
      version: "",
    };

    let firstVersion = true;
    for (const rom of versionedRoms) {
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

    versionedRoms.forEach((rom) => {
      if (rom.index !== highestVersionedRom.index) {
        const romToDeselect = roms[rom.index];
        if (romToDeselect) romToDeselect.selected = false;
      }
    });

    if (versionedRomsFound) {
      const nonVersionedRoms = roms.filter(
        (rom) =>
          !rom.labels.some((label) => label.match(versionSystem.pattern)),
      );
      nonVersionedRoms.forEach((rom) => (rom.selected = false));
    }

    if (versionedRomsFound) break;
  }
};

export default discardRomsBasedOnVersioningSystems;
