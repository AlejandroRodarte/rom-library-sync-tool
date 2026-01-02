import type Title from "../../classes/title.class.js";
import type { Console } from "../../types.js";

const titleToConsole = (title: Title, konsole: Console): void => {
  const consoleEntry = konsole.get(title.selectedRomAmount);
  if (consoleEntry) consoleEntry.set(title.name, title);
  else konsole.set(title.selectedRomAmount, new Map<string, Title>([[title.name, title]]));
};

export default titleToConsole;
