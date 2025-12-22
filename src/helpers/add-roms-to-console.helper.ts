import type { Console, Rom } from "../types.js";

const addRomsToConsole = (
  roms: Rom[],
  konsole: Console,
  title: string,
): void => {
  const romsSelected = roms.reduce((acc, rom) => {
    if (rom.selected) acc++;
    return acc;
  }, 0);

  if (romsSelected === 0) konsole.roms.selected.none.set(title, roms);
  else if (romsSelected > 1) konsole.roms.selected.multiple.set(title, roms);
  else konsole.roms.selected.one.set(title, roms);
};

export default addRomsToConsole;
