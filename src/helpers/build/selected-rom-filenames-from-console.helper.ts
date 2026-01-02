import type { Console } from "../../types.js";

const selectedRomFilenamesFromConsole = (konsole: Console): string[] => {
  const filenames: string[] = [];
  for (const [_, titles] of konsole)
    for (const [_, title] of titles) {
      for (const [_, rom] of title.selectedRomSet) filenames.push(rom.filename);
    }
  return filenames;
};

export default selectedRomFilenamesFromConsole;
