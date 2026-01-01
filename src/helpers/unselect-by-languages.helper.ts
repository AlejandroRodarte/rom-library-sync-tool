import type { Rom } from "../types.js";

const unselectByLanguages = (
  roms: Rom[],
  languageList: string[],
  keepSelected = 1,
): void => {
  const romsWithLanguages = roms.filter((rom) => rom.languages.length > 0);

  for (const language of languageList) {
    const selectedRoms = romsWithLanguages.filter((rom) => rom.selected);
    let romAmount = selectedRoms.length;
    if (romAmount === keepSelected) return;

    const romsWithoutLanguage = selectedRoms.filter(
      (rom) => !rom.languages.includes(language),
    );

    const romSetLacksLanguage =
      romsWithoutLanguage.length === selectedRoms.length;
    if (romSetLacksLanguage) continue;

    for (const romToUnselect of romsWithoutLanguage) {
      romToUnselect.selected = false;
      romAmount--;
      if (romAmount === keepSelected) return;
    }
  }
};

export default unselectByLanguages;
