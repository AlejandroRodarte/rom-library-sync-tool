import type { AddFileDiffAction } from "../interfaces/add-file-diff-action.interface.js";
import type { RemoveFileDiffAction } from "../interfaces/remove-file-diff-action.interface.js";

export type DiffAction = AddFileDiffAction | RemoveFileDiffAction;
