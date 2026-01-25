import type { AddRomDiffAction } from "../interfaces/add-rom-diff-action.interface.js";
import type { DeleteRomDiffAction } from "../interfaces/delete-rom-diff-action.interface.js";

export type RomDiffAction = AddRomDiffAction | DeleteRomDiffAction;
