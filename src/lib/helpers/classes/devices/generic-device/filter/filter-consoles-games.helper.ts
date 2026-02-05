import type { Consoles } from "../../../../../types/consoles/consoles.type.js";
import unselect from "../../../../unselect/index.js";

const filterConsolesGames = (consoles: Consoles): void => {
  for (const [, konsole] of consoles) {
    konsole.games.unselectTitles(unselect.byLocalDevice);
    konsole.games.update();
  }
};

export default filterConsolesGames;
