import ALL_MEDIA_NAMES from "../../../constants/media/all-media-names.constant.js";
import type { MediaName } from "../../../types/media/media-name.type.js";

const isMediaName = (m: string): m is MediaName =>
  ALL_MEDIA_NAMES.includes(m as MediaName);

export default isMediaName;
