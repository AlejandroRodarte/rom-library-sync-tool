import type { DeviceFileIOLsMethodSpecificErrorCode } from "../../device-file-io-ls-method-specific-error-code.type.js";
import type { DeviceFileIOSftpLsMethodErrorCodes } from "./device-file-io-sftp-ls-method-error-codes.type.js";

export type DeviceFileIOSftpLsMethodSpecificErrorCodeDictionary = {
  readonly [C in DeviceFileIOSftpLsMethodErrorCodes]: DeviceFileIOLsMethodSpecificErrorCode;
};
