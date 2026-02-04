import ALL_MEDIA_FS_TYPES from "../../../constants/all-media-fs-types.constant.js";
import type { MediaFsType } from "../../../types/media-fs-type.type.js";

const isMediaFsType = (s: string): s is MediaFsType =>
  ALL_MEDIA_FS_TYPES.includes(s as MediaFsType);

export default isMediaFsType;
