import ALL_CONTENT_TARGET_NAMES from "../../../constants/content-targets/all-content-target-names.constant.js";
import type { ContentTargetName } from "../../../types/content-targets/content-target-name.type.js";

const isContentTargetName = (s: string): s is ContentTargetName =>
  ALL_CONTENT_TARGET_NAMES.includes(s as ContentTargetName);

export default isContentTargetName;
