import type { Rom } from "../types.js";

const discardRomsBasedOnLanguageList = (
  roms: Rom[],
  languageList: string[],
): string => {
  const romsWithLanguages = roms.filter((rom) => rom.languages.length > 0);

  for (const language of languageList) {
    const selectedRoms = romsWithLanguages.filter((rom) => rom.selected);
    let romAmount = selectedRoms.length;
    if (romAmount === 1) return language;

    const romsWithoutLanguage = selectedRoms.filter(
      (rom) => !rom.languages.includes(language),
    );

    const romSetLacksLanguage =
      romsWithoutLanguage.length === selectedRoms.length;
    if (romSetLacksLanguage) continue;

    for (const romToUnselect of romsWithoutLanguage) {
      romToUnselect.selected = false;
      romAmount--;
      if (romAmount === 1) return language;
    }
  }
  return "";
};

export default discardRomsBasedOnLanguageList;
