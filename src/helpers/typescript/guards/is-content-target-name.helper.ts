import CONTENT_TARGET_NAMES from "../../../constants/content-target-names.constant.js";
import type { ContentTargetName } from "../../../types/content-target-name.type.js";

const isContentTargetName = (s: string): s is ContentTargetName =>
  CONTENT_TARGET_NAMES.includes(s as ContentTargetName);

export default isContentTargetName;
