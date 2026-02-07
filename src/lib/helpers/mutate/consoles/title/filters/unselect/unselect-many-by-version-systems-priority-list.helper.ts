import type Title from "../../../../../../classes/entities/title.class.js";
import type { RomIdAndVersion } from "../../../../../../interfaces/roms/rom-id-and-version.interface.js";
import type { RomVersionSystem } from "../../../../../../interfaces/roms/rom-version-system.interface.js";

const unselectManyByVersionSystemsPriorityList = (
  title: Title,
  versioningSystemsPriorityList: RomVersionSystem[],
): void => {
  if (!title.canUnselect()) return;

  for (const versionSystem of versioningSystemsPriorityList) {
    const versionedRoms: RomIdAndVersion[] = [];

    title.selectedRoms.entries.forEach(([id, rom]) => {
      const versionLabelIndex = rom.labels.findIndex((label) =>
        label.match(versionSystem.pattern),
      );

      if (versionLabelIndex !== -1) {
        const version = rom.labels[versionLabelIndex];
        if (version) versionedRoms.push({ id, version });
      }
    });

    const versionedRomsFound = versionedRoms.length > 0;
    if (!versionedRomsFound) continue;

    const romIdsWithHighestVersion: string[] = [];
    let highestVersion: string = "";

    let firstVersion = true;
    for (const rom of versionedRoms) {
      if (firstVersion) {
        romIdsWithHighestVersion.push(rom.id);
        highestVersion = rom.version;
        firstVersion = false;
        continue;
      }

      const result = versionSystem.compareFn(rom.version, highestVersion);
      const sameVersionFound = result === 0;
      const newHighestVersionFound = result === 1;

      if (sameVersionFound) romIdsWithHighestVersion.push(rom.id);
      else if (newHighestVersionFound) {
        romIdsWithHighestVersion.length = 0;
        romIdsWithHighestVersion.push(rom.id);
        highestVersion = rom.version;
      }
    }

    for (const versionedRom of versionedRoms) {
      const romIsOfLowerVersion = !romIdsWithHighestVersion.includes(
        versionedRom.id,
      );
      if (romIsOfLowerVersion) title.unselectOne(versionedRom.id);
    }

    if (versionedRomsFound) {
      const nonVersionedRomIds = title.selectedRoms.entries
        .filter(
          ([, rom]) =>
            !rom.labels.some((label) => label.match(versionSystem.pattern)),
        )
        .map(([id]) => id)
        .toArray();

      title.unselectMany(nonVersionedRomIds);
    }

    if (versionedRomsFound) break;
  }
};

export default unselectManyByVersionSystemsPriorityList;
