import type Title from "../../classes/entities/title.class.js";
import byBannedLabelSegmentsImposedBySpecialFlags from "./by-banned-label-segments-imposed-by-special-flags.helper.js";
import byBannedLabelSegments from "./by-banned-label-segments.helper.js";
import byBannedLabelsBasePriorityList from "./by-banned-labels-base-priority-list.helper.js";
import byCountryBasePriorityList from "./by-country-base-priority-list.helper.js";
import byLanguageAmount from "./by-language-amount.helper.js";
import byLanguagesBasePriorityList from "./by-languages-base-priority-list.helper.js";
import byPALAndNTSCLabels from "./by-pal-and-ntsc-labels.helper.js";
import byVersionsPriorityList from "./by-versions-priority-list.helper.js";
import byWhitelistedLabelsBasePriorityList from "./by-whitelisted-labels-base-priority-list.helper.js";

const byNormalTitle = (title: Title): void => {
  if (!title.canUnselect()) return;

  byCountryBasePriorityList(title);
  byLanguagesBasePriorityList(title);
  byLanguageAmount(title);
  byBannedLabelSegmentsImposedBySpecialFlags(title);
  byBannedLabelSegments(title, ["Disk"]);
  byVersionsPriorityList(title);
  byPALAndNTSCLabels(title);
  byBannedLabelsBasePriorityList(title);
  byWhitelistedLabelsBasePriorityList(title);
};

export default byNormalTitle;
