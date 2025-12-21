import type { Rom } from "./types.js";

const unselectByCountry = (
  roms: Rom[],
  country: string,
  allRomsAreUnreleased: boolean,
): [boolean, string] => {
  const countryRoms = roms.filter((rom) =>
    rom.labels.some((label) => label.includes(country)),
  );
  if (countryRoms.length === 0) return [false, ""];

  if (!allRomsAreUnreleased) {
    const countryAndUnwantedRoms = countryRoms.filter((rom) =>
      rom.labels.some(
        (label) =>
          label.includes("Beta") ||
          label.includes("Proto") ||
          label.includes("Demo") ||
          label.includes("Virtual Console"),
      ),
    );
    if (countryAndUnwantedRoms.length === countryRoms.length)
      return [false, ""];
  }

  countryRoms.forEach((rom) => (rom.selected = true));

  const nonCountryRoms = roms.filter(
    (rom) => !rom.labels.some((label) => label.includes(country)),
  );
  nonCountryRoms.forEach((rom) => (rom.selected = false));
  return [true, country];
};

export default unselectByCountry;
