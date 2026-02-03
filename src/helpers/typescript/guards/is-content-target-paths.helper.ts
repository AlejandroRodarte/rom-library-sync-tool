import CONTENT_TARGET_NAMES from "../../../constants/content-target-names.constant.js";
import type { ContentTargetPaths } from "../../../types/content-target-paths.type.js";

const isContentTargetPaths = (o: {
  [key: string]: string;
}): o is ContentTargetPaths => {
  const keys = Object.keys(o);

  if (keys.length !== CONTENT_TARGET_NAMES.length) return false;

  const sortedObjectKeys = [...keys].sort();
  const sortedContentTargetNameKeys = [...CONTENT_TARGET_NAMES].sort();

  for (let i = 0; i < sortedContentTargetNameKeys.length; i++)
    if (sortedObjectKeys[i] !== sortedContentTargetNameKeys[i]) return false;

  return true;
};

export default isContentTargetPaths;
