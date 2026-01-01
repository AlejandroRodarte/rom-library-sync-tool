import type { Console, Rom } from "../../types.js";

const addRomsToConsole = (
  roms: Rom[],
  konsole: Console,
  title: string,
): void => {
  const romsSelected = roms.reduce((acc, rom) => {
    if (rom.selected) acc++;
    return acc;
  }, 0);

  const consoleEntry = konsole.get(romsSelected);
  if (consoleEntry) consoleEntry.set(title, roms);
  else konsole.set(romsSelected, new Map<string, Rom[]>([[title, roms]]));
};

export default addRomsToConsole;
