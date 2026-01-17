import type { DeviceFileIOExistsMethodSpecificErrorCode } from "../../device-file-io-exists-method-specific-error-code.type.js";
import type { DeviceFileIOSftpExistsMethodErrorCodes } from "./device-file-io-sftp-exists-method-error-codes.type.js";

export type DeviceFileIOSftpExistsMethodSpecificErrorCodeDictionary = {
  readonly [C in DeviceFileIOSftpExistsMethodErrorCodes]: DeviceFileIOExistsMethodSpecificErrorCode;
};
