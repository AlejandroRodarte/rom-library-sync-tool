import type Title from "../../classes/title.class.js";
import byBannedLabelSegmentsImposedBySpecialFlags from "./by-banned-label-segments-imposed-by-special-flags.helper.js";
import byVersionsPriorityList from "./by-versions-priority-list.helper.js";

const byBiosTitle = (title: Title): void => {
  if (!title.canUnselect()) return;

  byBannedLabelSegmentsImposedBySpecialFlags(title);
  byVersionsPriorityList(title);
};

export default byBiosTitle;
