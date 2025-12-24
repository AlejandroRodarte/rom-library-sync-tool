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

    const highestVersionRomIndexes: number[] = [];
    let highestVersion: string = "";

    let firstVersion = true;
    for (const rom of versionedRoms) {
      if (firstVersion) {
        highestVersionRomIndexes.push(rom.index);
        highestVersion = rom.version;
        firstVersion = false;
        continue;
      }

      const result = versionSystem.compareFn(rom.version, highestVersion);
      const sameVersionFound = result === 0;
      const newHighestVersionFound = result === 1;

      if (sameVersionFound) highestVersionRomIndexes.push(rom.index);
      else if (newHighestVersionFound) {
        highestVersionRomIndexes.length = 0;
        highestVersionRomIndexes.push(rom.index);
        highestVersion = rom.version;
      }
    }

    versionedRoms.forEach((rom) => {
      if (!highestVersionRomIndexes.includes(rom.index)) {
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
