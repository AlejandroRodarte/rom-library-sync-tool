import type DeviceFileIOLsError from "../classes/errors/device-file-io-ls-error.class.js";
import type { DeviceFileIOLsEntry } from "./device-file-io-ls-entry.interface.js";

export interface DeviceFileIO {
  ls: (
    dirPath: string,
  ) => Promise<
    [DeviceFileIOLsEntry[], undefined] | [undefined, DeviceFileIOLsError]
  >;
}
