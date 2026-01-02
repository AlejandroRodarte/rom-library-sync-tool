import type Title from "../../classes/title.class.js";

interface RomIdAndLanguageAmount {
  id: string;
  languageAmount: number;
}

const byLanguageAmount = (title: Title): void => {
  if (!title.canUnselect()) return;

  const selectedRomsWithLanguages: RomIdAndLanguageAmount[] =
    title.selectedRomSet
      .entries()
      .filter(([, rom]) => rom.languages.length > 0)
      .map(([id, rom]) => ({ id, languageAmount: rom.languages.length }))
      .toArray();

  const romIdsWithHighestLanguageAmount: string[] = [];
  let highestLanguageAmount = 0;

  let firstRom = true;
  for (const rom of selectedRomsWithLanguages) {
    if (firstRom) {
      romIdsWithHighestLanguageAmount.push(rom.id);
      highestLanguageAmount = rom.languageAmount;
      firstRom = false;
      continue;
    }

    let comparisonResult = 0;
    if (rom.languageAmount > highestLanguageAmount) comparisonResult = 1;
    else if (rom.languageAmount < highestLanguageAmount) comparisonResult = -1;

    const sameLanguageAmountFound = comparisonResult === 0;
    const newHighestLanguageAmountFound = comparisonResult === 1;

    if (sameLanguageAmountFound) romIdsWithHighestLanguageAmount.push(rom.id);
    else if (newHighestLanguageAmountFound) {
      romIdsWithHighestLanguageAmount.length = 0;
      romIdsWithHighestLanguageAmount.push(rom.id);
      highestLanguageAmount = rom.languageAmount;
    }
  }

  for (const rom of selectedRomsWithLanguages) {
    const romHasLowerLanguageAmount = !romIdsWithHighestLanguageAmount.includes(
      rom.id,
    );
    if (romHasLowerLanguageAmount) title.unselectById(rom.id);
  }
};

export default byLanguageAmount;
