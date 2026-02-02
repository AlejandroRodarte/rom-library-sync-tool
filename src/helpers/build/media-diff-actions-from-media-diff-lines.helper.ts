import logger from "../../objects/logger.object.js";
import type { MediaDiffAction } from "../../types/media-diff-action.type.js";
import mediaDiffActionFromMediaDiffLine from "./media-diff-action-from-media-diff-line.helper.js";

const mediaDiffActionsFromMediaDiffLines = (
  mediaDiffLines: string[],
): [MediaDiffAction[], string[]] => {
  const failedLines: string[] = [];

  const mediaDiffActions = mediaDiffLines
    .map((mediaDiffLine) => {
      const [romDiffAction, parsingError] =
        mediaDiffActionFromMediaDiffLine(mediaDiffLine);

      if (parsingError) {
        logger.warn(
          parsingError.toString(),
          `Will add this diff line to the failed list.`,
        );
        failedLines.push(mediaDiffLine);
        return undefined;
      }

      return romDiffAction;
    })
    .filter((i) => typeof i !== "undefined");

  return [mediaDiffActions, failedLines];
};

export default mediaDiffActionsFromMediaDiffLines;
