import type { Consoles } from "../../../../types/consoles.type.js";
import unselect from "../../../unselect/index.js";

const filterConsoles = (consoles: Consoles): void => {
  for (const [, konsole] of consoles)
    konsole.unselectTitles(unselect.byLocalDevice);
};

export default filterConsoles;
