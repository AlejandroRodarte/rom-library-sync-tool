import type { Consoles } from "../../../../types/consoles.type.js";
import unselect from "../../../unselect/index.js";

const filterConsoles = (consoles: Consoles): void => {
  for (const [, konsole] of consoles)
    konsole.unselectTitles(unselect.byLocalDevice);

  for (const [, konsole] of consoles) {
    konsole.updateRoms();
    konsole.updateSelectedRoms();
    konsole.updateScrappedTitles();
    konsole.updateScrappedTitles();
  }
};

export default filterConsoles;
