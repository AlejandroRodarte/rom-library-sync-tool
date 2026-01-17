import type { ModeFromRightsError } from "../../../../../helpers/build/mode-from-rights.helper.js";
import type { AccessPathError } from "../../../../../helpers/extras/fs/access.helper.js";

export type DeviceFileIOFsExistsMethodErrorCodes =
  | ModeFromRightsError["code"]
  | AccessPathError["code"];
