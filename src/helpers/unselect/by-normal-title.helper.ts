import type Title from "../../classes/title.class.js";
import unselect from "./index.js";

const byNormalTitle = (title: Title): void => {
  if (!title.canUnselect()) return;

  unselect.byCountryBasePriorityList(title);
  unselect.byLanguagesBasePriorityList(title);
  unselect.byLanguageAmount(title);
  unselect.byBannedLabelSegmentsImposedBySpecialFlags(title);
  unselect.byBannedLabelSegments(title, ["Disk"]);
  unselect.byVersionsPriorityList(title);
  unselect.byPALAndNTSCLabels(title);
  unselect.byBannedLabelsBasePriorityList(title);
  unselect.byWhitelistedLabelsBasePriorityList(title);
};

export default byNormalTitle;
