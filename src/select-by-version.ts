import type { Rom } from "./types.js";

const selectByVersion = (
  roms: Rom[],
  versionFormat: RegExp,
  compare: (label1: string, label2: string) => number,
  shortCircuit = false,
): boolean => {
  if (shortCircuit) return shortCircuit;

  let groupHasVersionFormat = false;
  let [highestVersionIndex, highestVersion]: [number, string] = [-1, ""];

  for (const [index, rom] of roms.entries()) {
    let versionLabelFound = false;
    let firstVersion = true;

    for (const label of rom.labels) {
      if (versionLabelFound) break;

      if (label.match(versionFormat)) {
        if (!groupHasVersionFormat) groupHasVersionFormat = true;
        versionLabelFound = true;

        if (firstVersion) {
          highestVersion = label;
          highestVersionIndex = index;
          firstVersion = false;
          break;
        }

        const result = compare(label, highestVersion);
        const newHighestVersionFound = result === 1;

        if (newHighestVersionFound) {
          highestVersion = label;
          highestVersionIndex = index;
        }
      }
    }
  }

  if (groupHasVersionFormat && highestVersionIndex !== -1) {
    const highestVersionRom = roms[highestVersionIndex];
    if (highestVersionRom) highestVersionRom.selected = true;

    for (const [index, rom] of roms.entries()) {
      let romHasVersionLabel = false;
      for (const label of rom.labels) {
        if (label.match(versionFormat)) {
          romHasVersionLabel = true;
          break;
        }
      }
      if (romHasVersionLabel && index !== highestVersionIndex)
        rom.selected = false;
    }
  }

  return groupHasVersionFormat;
};

export default selectByVersion;
