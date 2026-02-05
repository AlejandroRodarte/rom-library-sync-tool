import AppBadTypeError from "../../../../../../classes/errors/app-bad-type-error.class.js";
import AppNotFoundError from "../../../../../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../../../../../classes/errors/app-validation-error.class.js";
import DIFF_LINE_SEPARATOR from "../../../../../../constants/diff-line-separator.constant.js";
import ALL_MEDIA_DIFF_ACTION_TYPES from "../../../../../../constants/media/all-media-diff-action-types.constant.js";
import ALL_MEDIA_FS_TYPES from "../../../../../../constants/media/all-media-fs-types.constant.js";
import { ADD_MEDIA, DELETE_MEDIA } from "../../../../../../constants/media/media-diff-action-types.constants.js";
import type { MediaDiffAction } from "../../../../../../types/classes/devices/generic-device/media/media-diff-action.type.js";
import typeGuards from "../../../../../typescript/guards/index.js";

export type MediaDiffActionFromMediaDiffLineError =
  | AppValidationError
  | AppNotFoundError
  | AppBadTypeError;

const mediaDiffActionFromMediaDiffLine = (
  diffLine: string,
):
  | [MediaDiffAction, undefined]
  | [undefined, MediaDiffActionFromMediaDiffLineError] => {
  const action = diffLine.split(DIFF_LINE_SEPARATOR);

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
        `Action type ${mediaActionType} is not valid. It must be one of the following: ${ALL_MEDIA_DIFF_ACTION_TYPES.join(", ")}.`,
      ),
    ];

  if (!typeGuards.isMediaFsType(mediaFsType))
    return [
      undefined,
      new AppBadTypeError(
        `Rom filesystem type ${mediaFsType} is not valid. It must be one of the following. ${ALL_MEDIA_FS_TYPES.join(", ")}.`,
      ),
    ];

  switch (mediaActionType) {
    case ADD_MEDIA:
      return [
        {
          type: ADD_MEDIA,
          data: { filename: mediaFilename, fs: { type: mediaFsType } },
        },
        undefined,
      ];
    case DELETE_MEDIA:
      return [
        {
          type: DELETE_MEDIA,
          data: { filename: mediaFilename, fs: { type: mediaFsType } },
        },
        undefined,
      ];
  }
};

export default mediaDiffActionFromMediaDiffLine;
