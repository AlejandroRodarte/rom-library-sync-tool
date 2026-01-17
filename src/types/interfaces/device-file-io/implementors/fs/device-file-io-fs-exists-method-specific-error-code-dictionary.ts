import type { DeviceFileIOExistsMethodSpecificErrorCode } from "../../device-file-io-exists-method-specific-error-code.type.js";
import type { DeviceFileIOFsExistsMethodErrorCodes } from "./device-file-io-fs-exists-method-error-codes.type.js";

export type DeviceFileIOFsExistsMethodSpecificErrorCodeDictionary = {
  readonly [C in DeviceFileIOFsExistsMethodErrorCodes]: DeviceFileIOExistsMethodSpecificErrorCode;
};
