import type { ExistsMethodError } from "../../../../../classes/sftp-client.class.js";
import type { ModeFromRightsError } from "../../../../../helpers/build/mode-from-rights.helper.js";

export type DeviceFileIOSftpExistsMethodErrorCodes =
  | ModeFromRightsError["code"]
  | ExistsMethodError["code"];
