import type { Rom, RomIndexAndVersion, VersionSystem } from "../../types.js";

const byVersionSystem = (
  roms: Rom[],
  versioningSystemsPriorityList: VersionSystem[],
  keepSelected = 1,
): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  for (const versionSystem of versioningSystemsPriorityList) {
    const versionedRoms: RomIndexAndVersion[] = [];

    selectedRoms.forEach((rom, index) => {
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

    for (const versionedRom of versionedRoms) {
      const romIsOfLowerVersion = !highestVersionRomIndexes.includes(
        versionedRom.index,
      );
      if (romIsOfLowerVersion) {
        const romToUnselect = selectedRoms[versionedRom.index];
        if (romToUnselect) {
          romToUnselect.selected = false;
          selectedRomAmount--;
          if (selectedRomAmount === keepSelected) return;
        }
      }
    }

    if (versionedRomsFound) {
      const nonVersionedRoms = selectedRoms.filter(
        (rom) =>
          !rom.labels.some((label) => label.match(versionSystem.pattern)),
      );
      for (const romToUnselect of nonVersionedRoms) {
        romToUnselect.selected = false;
        selectedRomAmount--;
        if (selectedRomAmount === keepSelected) return;
      }
    }

    if (versionedRomsFound) break;
  }
};

export default byVersionSystem;
