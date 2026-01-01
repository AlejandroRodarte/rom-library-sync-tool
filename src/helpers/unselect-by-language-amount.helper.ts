import type { Rom } from "../types.js";

interface RomIndexAndLanguageAmount {
  index: number;
  languageAmount: number;
}

const unselectByLanguageAmount = (roms: Rom[], keepSelected = 1): void => {
  const selectedRoms = roms.filter((rom) => rom.selected);

  let selectedRomAmount = selectedRoms.length;
  if (selectedRomAmount === keepSelected) return;

  const selectedRomsWithLanguages = selectedRoms.filter(
    (rom) => rom.languages.length > 0,
  );

  const selectedRomIndexesWithLanguages: RomIndexAndLanguageAmount[] =
    selectedRomsWithLanguages.map((r, i) => ({
      index: i,
      languageAmount: r.languages.length,
    }));

  const romIndexesWithHighestLanguageAmount: number[] = [];
  let highestLanguageAmount = 0;

  let firstRom = true;
  for (const rom of selectedRomIndexesWithLanguages) {
    if (firstRom) {
      romIndexesWithHighestLanguageAmount.push(rom.index);
      highestLanguageAmount = rom.languageAmount;
      firstRom = false;
      continue;
    }

    let comparisonResult = 0;
    if (rom.languageAmount > highestLanguageAmount) comparisonResult = 1;
    else if (rom.languageAmount < highestLanguageAmount) comparisonResult = -1;

    const sameLanguageAmountFound = comparisonResult === 0;
    const newHighestLanguageAmountFound = comparisonResult === 1;

    if (sameLanguageAmountFound)
      romIndexesWithHighestLanguageAmount.push(rom.index);
    else if (newHighestLanguageAmountFound) {
      romIndexesWithHighestLanguageAmount.length = 0;
      romIndexesWithHighestLanguageAmount.push(rom.index);
      highestLanguageAmount = rom.languageAmount;
    }
  }

  for (const rom of selectedRomIndexesWithLanguages) {
    const romHasLowerLanguageAmount =
      !romIndexesWithHighestLanguageAmount.includes(rom.index);
    if (romHasLowerLanguageAmount) {
      const romToUnselect = selectedRomsWithLanguages[rom.index];
      if (romToUnselect) {
        romToUnselect.selected = false;
        selectedRomAmount--;
        if (selectedRomAmount === keepSelected) return;
      }
    }
  }
};

export default unselectByLanguageAmount;
