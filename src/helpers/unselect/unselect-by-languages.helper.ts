import type { Rom } from "../../types.js";

const unselectByLanguages = (
  roms: Rom[],
  languagePriorityList: string[],
  keepSelected = 1,
): void => {
  const romsWithLanguages = roms.filter((rom) => rom.languages.length > 0);

  for (const language of languagePriorityList) {
    const selectedRoms = romsWithLanguages.filter((rom) => rom.selected);
    let selectedRomAmount = selectedRoms.length;
    if (selectedRomAmount === keepSelected) return;

    const romsWithoutLanguage = selectedRoms.filter(
      (rom) => !rom.languages.includes(language),
    );

    const romSetLacksLanguage =
      romsWithoutLanguage.length === selectedRoms.length;
    if (romSetLacksLanguage) continue;

    for (const romToUnselect of romsWithoutLanguage) {
      romToUnselect.selected = false;
      selectedRomAmount--;
      if (selectedRomAmount === keepSelected) return;
    }
  }
};

export default unselectByLanguages;
