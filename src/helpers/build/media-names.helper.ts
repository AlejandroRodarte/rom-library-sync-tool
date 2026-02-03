import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import ALL_OR_NONE from "../../constants/all-or-none.constant.js";
import MEDIA_NAMES from "../../constants/media-names.constant.js";
import type { MediaName } from "../../types/media-name.type.js";
import typeGuards from "../typescript/guards/index.js";

const mediaNames = (
  rawMediaNames: string | string[],
): [MediaName[], undefined] | [undefined, AppValidationError] => {
  const mediaNames: MediaName[] = [];

  if (typeof rawMediaNames === "string") {
    if (!typeGuards.isAllOrNone(rawMediaNames))
      [
        undefined,
        new AppValidationError(
          `Media names for a given console, when provided as a single string, it can only be one of the following values: ${ALL_OR_NONE.join(", ")}.`,
        ),
      ];

    switch (rawMediaNames) {
      case "all":
        mediaNames.push(...MEDIA_NAMES);
        break;
      case "none":
        break;
    }
  } else {
    if (!typeGuards.isMediaList(rawMediaNames))
      return [
        undefined,
        new AppValidationError(
          `The official media names allowed are: ${MEDIA_NAMES.join(", ")}. Your raw media list ${rawMediaNames} has element that do NOT belong to the official list.`,
        ),
      ];

    mediaNames.push(...rawMediaNames);
  }

  return [mediaNames, undefined];
};

export default mediaNames;
