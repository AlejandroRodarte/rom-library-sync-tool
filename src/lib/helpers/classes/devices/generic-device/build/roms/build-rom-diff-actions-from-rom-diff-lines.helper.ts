import logger from "../../../../../../objects/logger.object.js";
import type { RomDiffAction } from "../../../../../../types/classes/devices/generic-device/roms/rom-diff-action.type.js";
import buildRomDiffActionFromRomDiffLine from "./build-rom-diff-action-from-rom-diff-line.helper.js";

const buildRomDiffActionsFromRomDiffLines = (
  romDiffLines: string[],
): [RomDiffAction[], string[]] => {
  const failedLines: string[] = [];

  const romDiffActions = romDiffLines
    .map((romDiffLine) => {
      const [romDiffAction, parsingError] =
        buildRomDiffActionFromRomDiffLine(romDiffLine);

      if (parsingError) {
        logger.warn(
          parsingError.toString(),
          `Will add this diff line to the failed list.`,
        );
        failedLines.push(romDiffLine);
        return undefined;
      }

      return romDiffAction;
    })
    .filter((i) => typeof i !== "undefined");

  return [romDiffActions, failedLines];
};

export default buildRomDiffActionsFromRomDiffLines;
