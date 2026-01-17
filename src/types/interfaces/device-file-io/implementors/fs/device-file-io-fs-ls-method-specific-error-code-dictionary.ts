import type { DeviceFileIOLsMethodSpecificErrorCode } from "../../device-file-io-ls-method-specific-error-code.type.js";
import type { DeviceFileIOFsLsMethodErrorCodes } from "./device-file-io-fs-ls-method-error-codes.type.js";

export type DeviceFileIOFsLsMethodSpecificErrorCodeDictionary = {
  readonly [C in DeviceFileIOFsLsMethodErrorCodes]: DeviceFileIOLsMethodSpecificErrorCode;
};
