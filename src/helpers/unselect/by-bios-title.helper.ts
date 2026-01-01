import type { Rom } from "../../types.js";
import unselect from "./index.js";

const byBiosTitle = (roms: Rom[], keepSelected = 1): void => {
  unselect.byBannedLabelSegmentsImposedBySpecialFlags(roms, keepSelected);
  unselect.byBannedLabelSegments(roms, ["Disk"], keepSelected);
  unselect.byVersionsPriorityList(roms, keepSelected);
};

export default byBiosTitle;
