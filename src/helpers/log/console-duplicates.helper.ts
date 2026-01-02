import type { Console } from "../../types.js";

const consoleDuplicates = (konsole: Console): void => {
  for (const [romsSelected, titles] of konsole) {
    if (romsSelected <= 1) continue;
    console.log(`\n===== ${romsSelected} duplicates ======`);
    for (const [name, title] of titles) {
      console.log(`\n===== Showing duplicate ROMs for title ${name} =====`);
      for (const [, rom] of title.selectedRomSet) console.log(rom);
    }
  }
};

export default consoleDuplicates;
