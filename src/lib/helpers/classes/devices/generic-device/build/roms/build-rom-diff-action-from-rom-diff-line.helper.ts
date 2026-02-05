import AppBadTypeError from "../../../../../../classes/errors/app-bad-type-error.class.js";
import AppNotFoundError from "../../../../../../classes/errors/app-not-found-error.class.js";
import AppValidationError from "../../../../../../classes/errors/app-validation-error.class.js";
import ALL_ROM_DIFF_ACTION_TYPES from "../../../../../../constants/roms/all-rom-diff-action-types.constant.js";
import ALL_ROM_FS_TYPES from "../../../../../../constants/roms/all-rom-fs-types.constant.js";
import {
  ADD_ROM,
  DELETE_ROM,
} from "../../../../../../constants/roms/rom-diff-action-types.constants.js";
import type { RomDiffAction } from "../../../../../../types/classes/devices/generic-device/roms/rom-diff-action.type.js";
import typeGuards from "../../../../../typescript/guards/index.js";

export type BuildRomDiffActionFromRomDiffLineError =
  | AppValidationError
  | AppNotFoundError
  | AppBadTypeError;

const buildRomDiffActionFromRomDiffLine = (
  diffLine: string,
):
  | [RomDiffAction, undefined]
  | [undefined, BuildRomDiffActionFromRomDiffLineError] => {
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
        `Action type ${romActionType} is not valid. It must be one of the following: ${ALL_ROM_DIFF_ACTION_TYPES.join(", ")}.`,
      ),
    ];

  if (!typeGuards.isRomFsType(romFsType))
    return [
      undefined,
      new AppBadTypeError(
        `Rom filesystem type ${romFsType} is not valid. It must be one of the following. ${ALL_ROM_FS_TYPES.join(", ")}.`,
      ),
    ];

  switch (romActionType) {
    case ADD_ROM:
      return [
        {
          type: ADD_ROM,
          data: { filename: romFilename, fs: { type: romFsType } },
        },
        undefined,
      ];
    case DELETE_ROM:
      return [
        {
          type: DELETE_ROM,
          data: { filename: romFilename, fs: { type: romFsType } },
        },
        undefined,
      ];
  }
};

export default buildRomDiffActionFromRomDiffLine;
