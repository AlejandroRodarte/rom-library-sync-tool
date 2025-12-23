import type { Rom } from "../types.js";

const pickRomsBasedOnLanguageList = (
  roms: Rom[],
  languageList: string[],
): string => {
  let languageFound = "";
  for (const language of languageList) {
    const romSetHasLanguageLabel = roms.some((rom) =>
      rom.languages.includes(language),
    );
    if (romSetHasLanguageLabel) {
      languageFound = language;
      const unwantedRoms = roms.filter(
        (rom) => !rom.languages.includes(language),
      );
      unwantedRoms.forEach((rom) => (rom.selected = false));
    }
    if (languageFound) break;
  }
  return languageFound;
};

export default pickRomsBasedOnLanguageList;
