import AppValidationError from "../../../classes/errors/app-validation-error.class.js";
import ALL_AND_NONE from "../../../constants/all-and-none.constant.js";
import { ALL, NONE } from "../../../constants/all-none-rest.constants.js";
import ALL_MEDIA_NAMES from "../../../constants/media/all-media-names.constant.js";
import type { MediaName } from "../../../types/media/media-name.type.js";
import typeGuards from "../../typescript/guards/index.js";
import isStringArrayASubset from "../../validation/is-string-array-a-subset.helper.js";

const buildMediaNamesFromRawValue = (
  rawMediaNames: string | string[],
  validMediaNames: MediaName[] = [...ALL_MEDIA_NAMES],
): [MediaName[], undefined] | [undefined, AppValidationError] => {
  const mediaNames: MediaName[] = [];

  if (typeof rawMediaNames === "string") {
    if (!typeGuards.isAllOrNone(rawMediaNames))
      [
        undefined,
        new AppValidationError(
          `Media names for a given console, when provided as a single string, it can only be one of the following values: ${ALL_AND_NONE.join(", ")}.`,
        ),
      ];

    switch (rawMediaNames) {
      case ALL:
        mediaNames.push(...[...validMediaNames]);
        break;
      case NONE:
        break;
    }
  } else {
    if (!typeGuards.isMediaList(rawMediaNames))
      return [
        undefined,
        new AppValidationError(
          `The official media names allowed are: ${ALL_MEDIA_NAMES.join(", ")}. Your raw media list ${rawMediaNames} has element that do NOT belong to the official list.`,
        ),
      ];

    if (!isStringArrayASubset(validMediaNames, rawMediaNames))
      return [
        undefined,
        new AppValidationError(
          `Attempted to create media name list based on the following "official list": ${validMediaNames.join(", ")}. However, the "real list" provided has elements that are NOT in the official list: ${rawMediaNames.join(", ")}. Please make the "real list" be a subset of the "official list".`,
        ),
      ];

    mediaNames.push(...[...rawMediaNames]);
  }

  return [mediaNames, undefined];
};

export default buildMediaNamesFromRawValue;
