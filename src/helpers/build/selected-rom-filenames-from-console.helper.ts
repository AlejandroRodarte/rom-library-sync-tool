import type { Console } from "../../types.js";

const selectedRomFilenamesFromConsole = (konsole: Console): string[] => {
  const filenames: string[] = [];
  for (const [_, groups] of konsole)
    for (const [_, roms] of groups) {
      const selectedRoms = roms.filter((rom) => rom.selected);
      for (const rom of selectedRoms) filenames.push(rom.filename);
    }
  return filenames;
};

export default selectedRomFilenamesFromConsole;
