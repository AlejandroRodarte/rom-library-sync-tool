import type { AddMediaDiffAction } from "../../../../../interfaces/classes/devices/generic-device/media/add-media-diff-action.interface.js";
import type { DeleteMediaDiffAction } from "../../../../../interfaces/classes/devices/generic-device/media/delete-media-diff-action.interface.js";

export type MediaDiffAction = AddMediaDiffAction | DeleteMediaDiffAction;
