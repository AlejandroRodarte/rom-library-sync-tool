import type { Rom } from "../../types.js";
import unselect from "./index.js";

const byNormalTitle = (roms: Rom[], keepSelected = 1): void => {
  unselect.byCountryBasePriorityList(roms, keepSelected);
  unselect.byLanguagesBasePriorityList(roms, keepSelected);
  unselect.byLanguageAmount(roms, keepSelected);
  unselect.byBannedLabelSegmentsImposedBySpecialFlags(roms, keepSelected);
  unselect.byBannedLabelSegments(roms, ["Disk"], keepSelected);
  unselect.byVersionsPriorityList(roms, keepSelected);
  unselect.byPALAndNTSCLabels(roms, keepSelected);
  unselect.byBannedLabelsBasePriorityList(roms, keepSelected);
  unselect.byWhitelistedLabelsBasePriorityList(roms, keepSelected);
};

export default byNormalTitle;
