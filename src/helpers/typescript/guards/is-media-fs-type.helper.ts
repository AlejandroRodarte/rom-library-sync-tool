import MEDIA_FS_TYPES from "../../../constants/media-fs-types.constant.js";
import type { MediaFsType } from "../../../types/media-fs-type.type.js";

const isMediaFsType = (s: string): s is MediaFsType =>
  MEDIA_FS_TYPES.includes(s as MediaFsType);

export default isMediaFsType;
