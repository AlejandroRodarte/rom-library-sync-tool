import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import ALL_AND_NONE from "../../../constants/all-and-none.constant.js";
import { ALL, NONE } from "../../../constants/all-none-rest.constants.js";
import ALL_CONTENT_TARGET_NAMES from "../../../constants/content-targets/all-content-target-names.constant.js";
import type { ContentTargetName } from "../../../types/content-targets/content-target-name.type.js";
import typeGuards from "../../typescript/guards/index.js";
import isStringArrayASubset from "../../validation/is-string-array-a-subset.helper.js";

const buildContentTargetNamesFromRawValue = (
  rawContentTargetNames: string | string[],
  validContentTargetNames: ContentTargetName[] = [...ALL_CONTENT_TARGET_NAMES],
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
      case ALL:
        contentTargetNames.push(...[...validContentTargetNames]);
        break;
      case NONE:
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

    if (!isStringArrayASubset(validContentTargetNames, rawContentTargetNames))
      return [
        undefined,
        new AppValidationError(
          `Attempted to build a content target name list based on the following "official list": ${validContentTargetNames.join(", ")}. However, the "real list" has elements that are NOT part of the official list: ${rawContentTargetNames.join(", ")}. Please make sure the "real list" is a subset of the "official list".`,
        ),
      ];

    contentTargetNames.push(...[...rawContentTargetNames]);
  }

  return [contentTargetNames, undefined];
};

export default buildContentTargetNamesFromRawValue;
