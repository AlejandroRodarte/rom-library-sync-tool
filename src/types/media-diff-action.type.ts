import type { AddMediaDiffAction } from "../interfaces/add-media-diff-action.interface.js";
import type { DeleteMediaDiffAction } from "../interfaces/delete-media-diff-action.interface.js";

export type MediaDiffAction = AddMediaDiffAction | DeleteMediaDiffAction;
