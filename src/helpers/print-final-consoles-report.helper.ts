import type { Consoles, DuplicatesData, Groups, Rom } from "../types.js";

const printFinalConsolesReport = (consoles: Consoles): void => {
  let totalNoneSelected = 0;
  let totalOneSelected = 0;
  let totalMultipleSelected = 0;

  for (const [name, konsole] of consoles) {
    console.log(`===== Report for console ${name} =====`);

    const noneSelected = konsole.roms.selected.none.size;
    const oneSelected = konsole.roms.selected.one.size;
    const multipleSelected = konsole.roms.selected.multiple.size;

    console.log(`ROMs with 0 selections: ${noneSelected}`);
    console.log(`ROMs with 1 selection: ${oneSelected}`);
    console.log(`ROMs with >1 selections: ${multipleSelected}`);

    totalNoneSelected += noneSelected;
    totalOneSelected += oneSelected;
    totalMultipleSelected += multipleSelected;
  }

  console.log(`===== Global Report =====`);
  console.log(`ROMs with 0 selections: ${totalNoneSelected}`);
  console.log(`ROMs with 1 selection: ${totalOneSelected}`);
  console.log(`ROMs with >1 selections: ${totalMultipleSelected}`);

  console.log(`===== Duplicates Report =====`);
  const duplicatesData: DuplicatesData = new Map<number, Groups>();
  for (const [_, konsole] of consoles) {
    for (const [title, roms] of konsole.roms.selected.multiple) {
      const amount = roms.reduce((acc, rom) => {
        if (rom.selected) acc++;
        return acc;
      }, 0);
      const amountData = duplicatesData.get(amount);
      if (amountData) amountData.set(title, roms);
      else duplicatesData.set(amount, new Map<string, Rom[]>([[title, roms]]));
    }
  }

  for (const [amount, groups] of duplicatesData) {
    console.log(`ROMs with ${amount} duplicates: ${groups.size}`);
  }
};

export default printFinalConsolesReport;
