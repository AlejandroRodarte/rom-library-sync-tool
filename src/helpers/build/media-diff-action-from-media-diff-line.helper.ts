import AppBadTypeError from "../../classes/errors/app-bad-type-error.class.js";
import AppNotFoundError from "../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import MEDIA_DIFF_ACTION_TYPES from "../../constants/media-diff-action-types.constant.js";
import MEDIA_FS_TYPES from "../../constants/media-fs-types.constant.js";
import type { MediaDiffAction } from "../../types/media-diff-action.type.js";
import typeGuards from "../typescript/guards/index.js";

export type MediaDiffActionFromMediaDiffLineError =
  | AppValidationError
  | AppNotFoundError
  | AppBadTypeError;

const mediaDiffActionFromMediaDiffLine = (
  diffLine: string,
):
  | [MediaDiffAction, undefined]
  | [undefined, MediaDiffActionFromMediaDiffLineError] => {
  const action = diffLine.split("|");

  if (action.length !== 3)
    return [
      undefined,
      new AppValidationError(
        `Error procesing action ${action}. It should be a string made up of three substrings separated by a pipe (|) symbol.`,
      ),
    ];

  const [mediaActionType, mediaFsType, mediaFilename] = action;
  if (!mediaActionType || !mediaFsType || !mediaFilename)
    return [
      undefined,
      new AppNotFoundError(
        `Error processing diff line ${diffLine}. It lacks either the action type, media filesystem type, and/or the media filename/dirname.`,
      ),
    ];

  if (!typeGuards.isMediaDiffActionType(mediaActionType))
    return [
      undefined,
      new AppBadTypeError(
        `Action type ${mediaActionType} is not valid. It must be one of the following: ${MEDIA_DIFF_ACTION_TYPES.join(", ")}.`,
      ),
    ];

  if (!typeGuards.isMediaFsType(mediaFsType))
    return [
      undefined,
      new AppBadTypeError(
        `Rom filesystem type ${mediaFsType} is not valid. It must be one of the following. ${MEDIA_FS_TYPES.join(", ")}.`,
      ),
    ];

  switch (mediaActionType) {
    case "add-media":
      return [
        {
          type: "add-media",
          data: { filename: mediaFilename, fs: { type: mediaFsType } },
        },
        undefined,
      ];
    case "delete-media":
      return [
        {
          type: "delete-media",
          data: { filename: mediaFilename, fs: { type: mediaFsType } },
        },
        undefined,
      ];
  }
};

export default mediaDiffActionFromMediaDiffLine;
