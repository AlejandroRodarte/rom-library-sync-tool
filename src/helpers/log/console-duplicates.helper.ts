import type { Console } from "../../types.js";

const printConsoleDuplicates = (konsole: Console): void => {
  for (const [romsSelected, groups] of konsole) {
    if (romsSelected <= 1) continue;
    console.log(`\n===== ${romsSelected} duplicates ======`);
    for (const [title, roms] of groups) {
      console.log(`\n===== Showing duplicate ROMs for title ${title} =====`);
      const selectedRoms = roms.filter((rom) => rom.selected);
      for (const rom of selectedRoms) console.log(rom);
    }
  }
};

export default printConsoleDuplicates;
