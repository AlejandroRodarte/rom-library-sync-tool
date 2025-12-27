import type { Console } from "../types.js";

const printConsoleDuplicates = (konsole: Console): void => {
  for (const [title, roms] of konsole.roms.selected.multiple) {
    console.log(`\n===== Showing duplicate ROMs for title ${title} =====`);
    const selectedRoms = roms.filter((rom) => rom.selected);
    for (const rom of selectedRoms) console.log(rom);
  }
};

export default printConsoleDuplicates;
