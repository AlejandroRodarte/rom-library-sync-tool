import type { MediaDiffAction } from "../../types/media-diff-action.type.js";

const mediaDiffLineFromMediaDiffAction = (
  diffAction: MediaDiffAction,
): string => {
  switch (diffAction.type) {
    case "add-media":
      return `add-media|${diffAction.data.fs.type}|${diffAction.data.filename}`;
    case "delete-media":
      return `delete-media|${diffAction.data.fs.type}|${diffAction.data.filename}`;
  }
};

export default mediaDiffLineFromMediaDiffAction;
