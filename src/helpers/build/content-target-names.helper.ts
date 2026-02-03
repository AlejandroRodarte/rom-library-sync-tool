import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import ALL_OR_NONE from "../../constants/all-or-none.constant.js";
import CONTENT_TARGET_NAMES from "../../constants/content-target-names.constant.js";
import type { ContentTargetName } from "../../types/content-target-name.type.js";
import typeGuards from "../typescript/guards/index.js";

const contentTargetNames = (
  rawContentTargetNames: string | string[],
): [ContentTargetName[], undefined] | [undefined, AppValidationError] => {
  const contentTargetNames: ContentTargetName[] = [];
  if (typeof rawContentTargetNames === "string") {
    if (!typeGuards.isAllOrNone(rawContentTargetNames))
      return [
        undefined,
        new AppValidationError(
          `When content target is provided as a single string, it can only be one of two values: ${ALL_OR_NONE.join(", ")}.`,
        ),
      ];

    switch (rawContentTargetNames) {
      case "all":
        contentTargetNames.push(...CONTENT_TARGET_NAMES);
        break;
      case "none":
        break;
    }
  } else {
    if (!typeGuards.isContentTargetList(rawContentTargetNames))
      return [
        undefined,
        new AppValidationError(
          `Valid content target names are: ${CONTENT_TARGET_NAMES.join(", ")}. Your content target names list ${rawContentTargetNames} has elements that do not belong to the official list.`,
        ),
      ];

    contentTargetNames.push(...rawContentTargetNames);
  }

  return [contentTargetNames, undefined];
};

export default contentTargetNames;
