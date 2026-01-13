import MEDIA_NAMES from "../../constants/media-names.constant.js";
import type { MediaName } from "../../types/media-name.type.js";
import type { MediasList } from "../../types/medias-list.type.js";

const mediaNamesFromMediasList = (mediasList: MediasList): MediaName[] => {
  const mediaNames: MediaName[] = [];

  for (const mediasListItem of mediasList) {
    if (mediasListItem === "none") {
      mediaNames.length = 0;
      break;
    } else if (mediasListItem === "all") {
      mediaNames.length = 0;
      MEDIA_NAMES.forEach((d) => mediaNames.push(d));
      break;
    } else mediaNames.push(mediasListItem);
  }

  return mediaNames;
};

export default mediaNamesFromMediasList;
