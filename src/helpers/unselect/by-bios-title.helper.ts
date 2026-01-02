import type Title from "../../classes/title.class.js";
import unselect from "./index.js";

const byBiosTitle = (title: Title): void => {
  if (!title.canUnselect()) return;

  unselect.byBannedLabelSegmentsImposedBySpecialFlags(title);
  unselect.byVersionsPriorityList(title);
};

export default byBiosTitle;
