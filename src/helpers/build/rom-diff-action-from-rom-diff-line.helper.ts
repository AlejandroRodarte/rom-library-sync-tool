import AppNotFoundError from "../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../classes/errors/app-validation-error.class.js";
import AppBadTypeError from "../../classes/errors/app-bad-type-error.class.js";
import type { RomDiffAction } from "../../types/rom-diff-action.type.js";
import typeGuards from "../typescript/guards/index.js";
import ROM_DIFF_ACTION_TYPES from "../../constants/rom-diff-action-types.constant.js";
import ROM_FS_TYPES from "../../constants/rom-fs-types.constant.js";

export type RomDiffActionFromRomDiffLineError =
  | AppValidationError
  | AppNotFoundError
  | AppBadTypeError;

const romDiffActionFromRomDiffLine = (
  diffLine: string,
):
  | [RomDiffAction, undefined]
  | [undefined, RomDiffActionFromRomDiffLineError] => {
  const action = diffLine.split("|");

  if (action.length !== 3)
    return [
      undefined,
      new AppValidationError(
        `Error procesing action ${action}. It should be a string made up of three substrings separated by a pipe (|) symbol.`,
      ),
    ];

  const [romActionType, romFsType, romFilename] = action;
  if (!romActionType || !romFsType || !romFilename)
    return [
      undefined,
      new AppNotFoundError(
        `Error processing diff line ${diffLine}. It lacks either the action type, rom filesystem type, and/or the rom filename.`,
      ),
    ];

  if (!typeGuards.isRomDiffActionType(romActionType))
    return [
      undefined,
      new AppBadTypeError(
        `Action type ${romActionType} is not valid. It must be one of the following: ${ROM_DIFF_ACTION_TYPES.join(", ")}.`,
      ),
    ];

  if (!typeGuards.isRomFsType(romFsType))
    return [
      undefined,
      new AppBadTypeError(
        `Rom filesystem type ${romFsType} is not valid. It must be one of the following. ${ROM_FS_TYPES.join(", ")}.`,
      ),
    ];

  switch (romActionType) {
    case "add-rom":
      return [
        {
          type: "add-rom",
          data: { filename: romFilename, fs: { type: romFsType } },
        },
        undefined,
      ];
    case "delete-rom":
      return [
        {
          type: "delete-rom",
          data: { filename: romFilename, fs: { type: romFsType } },
        },
        undefined,
      ];
  }
};

export default romDiffActionFromRomDiffLine;
