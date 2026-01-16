import CONTENT_TARGET_NAMES from "../../constants/content-target-names.constant.js";
import type { ContentTargetName } from "../../types/content-target-name.type.js";
import type { ContentTargetsList } from "../../types/content-targets-list.type.js";

const contentTargetNamesFromContentTargetsList = (
  contentTargetsList: ContentTargetsList,
): ContentTargetName[] => {
  const contentTargetNames: ContentTargetName[] = [];

  for (const mediasListItem of contentTargetsList) {
    if (mediasListItem === "none") {
      contentTargetNames.length = 0;
      break;
    } else if (mediasListItem === "all") {
      contentTargetNames.length = 0;
      CONTENT_TARGET_NAMES.forEach((d) => contentTargetNames.push(d));
      break;
    } else contentTargetNames.push(mediasListItem);
  }

  return contentTargetNames;
};

export default contentTargetNamesFromContentTargetsList;
