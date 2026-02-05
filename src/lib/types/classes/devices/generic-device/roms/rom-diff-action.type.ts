import type { AddRomDiffAction } from "../../../../../interfaces/classes/devices/generic-device/roms/add-rom-diff-action.interface.js";
import type { DeleteRomDiffAction } from "../../../../../interfaces/classes/devices/generic-device/roms/delete-rom-diff-action.interface.js";

export type RomDiffAction = AddRomDiffAction | DeleteRomDiffAction;
