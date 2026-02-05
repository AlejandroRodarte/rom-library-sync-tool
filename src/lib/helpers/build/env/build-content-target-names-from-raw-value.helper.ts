import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import ALL_AND_NONE from "../../../constants/all-and-none.constant.js";
import ALL_CONTENT_TARGET_NAMES from "../../../constants/content-targets/all-content-target-names.constant.js";
import type { ContentTargetName } from "../../../types/content-targets/content-target-name.type.js";
import typeGuards from "../../typescript/guards/index.js";

const buildContentTargetNamesFromRawValue = (
  rawContentTargetNames: string | string[],
): [ContentTargetName[], undefined] | [undefined, AppValidationError] => {
  const contentTargetNames: ContentTargetName[] = [];
  if (typeof rawContentTargetNames === "string") {
    if (!typeGuards.isAllOrNone(rawContentTargetNames))
      return [
        undefined,
        new AppValidationError(
          `When content target is provided as a single string, it can only be one of two values: ${ALL_AND_NONE.join(", ")}.`,
        ),
      ];

    switch (rawContentTargetNames) {
      case "all":
        contentTargetNames.push(...ALL_CONTENT_TARGET_NAMES);
        break;
      case "none":
        break;
    }
  } else {
    if (!typeGuards.isContentTargetList(rawContentTargetNames))
      return [
        undefined,
        new AppValidationError(
          `Valid content target names are: ${ALL_CONTENT_TARGET_NAMES.join(", ")}. Your content target names list ${rawContentTargetNames} has elements that do not belong to the official list.`,
        ),
      ];

    contentTargetNames.push(...rawContentTargetNames);
  }

  return [contentTargetNames, undefined];
};

export default buildContentTargetNamesFromRawValue;
