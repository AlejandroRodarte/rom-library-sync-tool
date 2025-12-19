import type { Rom } from "./types.js";

const selectByVersion = (
  roms: Rom[],
  versionFormat: RegExp,
  versionParser: (label: string) => number,
  shortCircuit = false,
): boolean => {
  if (shortCircuit) return shortCircuit;

  let groupHasVersionFormat = false;
  let [highestVersionIndex, highestVersion]: [number, number] = [-1, -1];

  for (const [index, rom] of roms.entries()) {
    for (const label of rom.labels) {
      if (label.match(versionFormat)) {
        groupHasVersionFormat = true;
        const version = versionParser(label);

        const firstVersion = highestVersion === -1;
        const newHighestVersionFound = firstVersion
          ? false
          : version > highestVersion;

        if (newHighestVersionFound) {
          const lowerVersionRom = roms[highestVersionIndex];
          if (lowerVersionRom) lowerVersionRom.selected = false;
        }

        if (firstVersion || newHighestVersionFound) {
          highestVersion = version;
          highestVersionIndex = index;
          rom.selected = true;
        }
      }
    }
  }

  if (groupHasVersionFormat) {
    for (const rom of roms) {
      let romHasVersionLabel = false;
      for (const label of rom.labels) {
        if (label.match(versionFormat)) {
          romHasVersionLabel = true;
          break;
        }
      }
      if (!romHasVersionLabel) rom.selected = false;
    }
  }

  return groupHasVersionFormat;
};

export default selectByVersion;
