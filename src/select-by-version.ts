import type { Rom } from "./types.js";

interface RomIndexAndVersion {
  index: number;
  version: string;
}

const selectByVersion = (
  roms: Rom[],
  versionFormat: RegExp,
  compare: (label1: string, label2: string) => number,
  countryLabel: string,
  shortCircuit = false,
): boolean => {
  if (shortCircuit) return shortCircuit;

  const countryVersionedRoms: RomIndexAndVersion[] = [];
  roms.forEach((rom, index) => {
    const hasCountryLabel = rom.labels.some((label) =>
      label.includes(countryLabel),
    );
    const versionLabelIndex = rom.labels.findIndex((label) =>
      label.match(versionFormat),
    );
    const lacksUnwantedLabel = !rom.labels.some((label) =>
      label.includes("Beta"),
    );

    if (hasCountryLabel && versionLabelIndex !== -1 && lacksUnwantedLabel) {
      const version = rom.labels[versionLabelIndex];
      if (version) countryVersionedRoms.push({ index, version });
    }
  });

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

    const result = compare(rom.version, highestVersionedRom.version);
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

  if (countryVersionedRoms.length > 0) {
    const countryNonVersionedRoms = roms.filter((rom) => {
      const hasCountryLabel = rom.labels.some((label) =>
        label.includes(countryLabel),
      );
      const lacksVersionLabel = !rom.labels.some((label) =>
        label.match(versionFormat),
      );
      return hasCountryLabel && lacksVersionLabel;
    });

    countryNonVersionedRoms.forEach((rom) => (rom.selected = false));
  }

  return countryVersionedRoms.length > 0;
};

export default selectByVersion;
