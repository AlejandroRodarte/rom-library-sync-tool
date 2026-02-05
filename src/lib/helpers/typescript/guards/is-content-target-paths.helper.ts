import ALL_CONTENT_TARGET_NAMES from "../../../constants/content-targets/all-content-target-names.constant.js";
import type { ContentTargetPaths } from "../../../types/content-targets/content-target-paths.type.js";

const isContentTargetPaths = (o: {
  [key: string]: string;
}): o is ContentTargetPaths => {
  const keys = Object.keys(o);

  if (keys.length !== ALL_CONTENT_TARGET_NAMES.length) return false;

  const sortedObjectKeys = [...keys].sort();
  const sortedContentTargetNameKeys = [...ALL_CONTENT_TARGET_NAMES].sort();

  for (let i = 0; i < sortedContentTargetNameKeys.length; i++)
    if (sortedObjectKeys[i] !== sortedContentTargetNameKeys[i]) return false;

  return true;
};

export default isContentTargetPaths;
