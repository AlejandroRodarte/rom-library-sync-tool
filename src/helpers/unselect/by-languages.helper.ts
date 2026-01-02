import type Title from "../../classes/title.class.js";

interface RomIdAndLanguages {
  id: string;
  languages: string[];
}

const byLanguages = (title: Title, languagePriorityList: string[]): void => {
  if (!title.canUnselect()) return;

  const romsWithLanguages: RomIdAndLanguages[] = title.selectedRomSet
    .entries()
    .filter(([, rom]) => rom.languages.length > 0)
    .map(([id, rom]) => ({ id, languages: rom.languages }))
    .toArray();

  for (const language of languagePriorityList) {
    if (!title.canUnselect()) break;

    const romsWithoutLanguage = romsWithLanguages.filter(
      (rom) => !rom.languages.includes(language),
    );

    const romSetLacksLanguage =
      romsWithoutLanguage.length === romsWithLanguages.length;
    if (romSetLacksLanguage) continue;

    title.unselectByIds(romsWithoutLanguage.map((rom) => rom.id));
  }
};

export default byLanguages;
