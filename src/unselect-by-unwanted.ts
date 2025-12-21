import type { Rom } from "./types.js";

const unselectByUnwanted = (
  roms: Rom[],
  unwantedLabels: string[],
  countryLabel: string,
): void => {
  if (unwantedLabels.length === 0) return;

  const countryRoms = roms.filter((rom) =>
    rom.labels.some((label) => label.includes(countryLabel)),
  );

  for (const unwantedLabel of unwantedLabels) {
    const unwantedRoms = countryRoms.filter((rom) =>
      rom.labels.some((label) => label.includes(unwantedLabel)),
    );
    unwantedRoms.forEach((rom) => (rom.selected = false));
  }
};

export default unselectByUnwanted;
