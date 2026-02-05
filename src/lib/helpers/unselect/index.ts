import byBannedLabelSegments from "./by-banned-label-segments.helper.js";
import byBannedLabelsBasePriorityList from "./by-banned-labels-base-priority-list.helper.js";
import byBannedLabels from "./by-banned-labels.helper.js";
import byCountryBasePriorityList from "./by-country-base-priority-list.helper.js";
import byCountry from "./by-country.helper.js";
import byLanguageAmount from "./by-language-amount.helper.js";
import byLanguagesBasePriorityList from "./by-languages-base-priority-list.helper.js";
import byLanguages from "./by-languages.helper.js";
import byPALAndNTSCLabels from "./by-pal-and-ntsc-labels.helper.js";
import byBannedLabelSegmentsImposedBySpecialFlags from "./by-banned-label-segments-imposed-by-special-flags.helper.js";
import byVersionSystem from "./by-version-systems.helper.js";
import byVersionsPriorityList from "./by-versions-priority-list.helper.js";
import byWhitelistedLabelsBasePriorityList from "./by-whitelisted-labels-base-priority-list.helper.js";
import byWhitelistedLabels from "./by-whitelisted-labels.helper.js";
import byNormalTitle from "./by-normal-title.helper.js";
import byBiosTitle from "./by-bios-title.helper.js";
import byLocalDevice from "./by-local-device.helper.js";
import bySteamDeckDevice from "./by-steam-deck-device.helper.js";

const unselect = {
  byCountry,
  byCountryBasePriorityList,
  byLanguages,
  byLanguagesBasePriorityList,
  byLanguageAmount,
  byBannedLabels,
  byBannedLabelSegments,
  byWhitelistedLabels,
  byVersionSystem,
  byBannedLabelSegmentsImposedBySpecialFlags,
  byPALAndNTSCLabels,
  byVersionsPriorityList,
  byBannedLabelsBasePriorityList,
  byWhitelistedLabelsBasePriorityList,
  byNormalTitle,
  byBiosTitle,
  byLocalDevice,
  bySteamDeckDevice,
};

export default unselect;
