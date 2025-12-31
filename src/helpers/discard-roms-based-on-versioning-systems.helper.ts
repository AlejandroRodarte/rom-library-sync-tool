import VERSIONING_SYSTEMS_PRIORITY_LIST from "../constants/versioning-systems-priority-list.constant.js";
import VERSIONING_SYSTEMS_PRIORITY_LIST_FOR_UNRELEASED_ROMS from "../constants/versioning-systems-priority-list-for-unreleased-roms.constant.js";
import type { Rom, RomIndexAndVersion, VersionSystem } from "../types.js";
import getSpecialFlagsFromRomSet from "./get-special-flags-from-rom-set.helper.js";

const discardRomsBasedOnVersioningSystems = (roms: Rom[]): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);

  let romAmount = selectedRoms.length;
  if (romAmount === 1) return;

  const specialFlags = getSpecialFlagsFromRomSet(selectedRoms);
  const versionSystems: VersionSystem[] = [];
  if (specialFlags.allRomsAreUnreleased)
    versionSystems.push(
      ...VERSIONING_SYSTEMS_PRIORITY_LIST_FOR_UNRELEASED_ROMS,
    );
  versionSystems.push(...VERSIONING_SYSTEMS_PRIORITY_LIST);

  for (const versionSystem of versionSystems) {
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
          romAmount--;
          if (romAmount === 1) return;
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
        romAmount--;
        if (romAmount === 1) return;
      }
    }

    if (versionedRomsFound) break;
  }
};

export default discardRomsBasedOnVersioningSystems;
