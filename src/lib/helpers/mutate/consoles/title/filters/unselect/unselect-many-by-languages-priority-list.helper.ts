import type Title from "../../../../../../classes/entities/title.class.js";
import type { RomLanguage } from "../../../../../../types/roms/rom-language.type.js";

interface RomIdAndLanguages {
  id: string;
  languages: RomLanguage[];
}

const unselectManyByLanguagesPriorityList = (
  title: Title,
  languagePriorityList: RomLanguage[],
): void => {
  if (!title.canUnselect()) return;

  let romsWithLanguages: RomIdAndLanguages[] = title.selectedRoms.entries
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

    const romIdsWithoutLanguage = romsWithoutLanguage.map((rom) => rom.id);

    title.unselectMany(romIdsWithoutLanguage);
    romsWithLanguages = romsWithLanguages.filter(
      (rom) => !romIdsWithoutLanguage.includes(rom.id),
    );
  }
};

export default unselectManyByLanguagesPriorityList;
