import type { DeviceFileIOLsMethodSpecificErrorCode } from "../../types/interfaces/device-file-io/device-file-io-ls-method-specific-error-code.type.js";
import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class DeviceFileIOLsError extends CustomError {
  readonly type = "DeviceFileIOLsError";
  readonly status = 400;
  readonly code = "DEVICE_FILE_IO_LS_ERROR";
  readonly message =
    "A problem occured while fetching contents from a device directory.";

  private _reason: string;
  private _linkedError: UniversalError | undefined;

  private _specificCode: DeviceFileIOLsMethodSpecificErrorCode;

  constructor(
    reason: string,
    specificCode: DeviceFileIOLsMethodSpecificErrorCode,
    linkedError?: UniversalError,
  ) {
    super();
    this._reason = reason;
    this._specificCode = specificCode;
    if (linkedError) this._linkedError = linkedError;
  }

  get reason(): string {
    return this._reason;
  }

  get specificCode(): DeviceFileIOLsMethodSpecificErrorCode {
    return this._specificCode;
  }

  public toUniversalError(): UniversalError {
    return new UniversalError(
      this.type,
      [this.message, this._reason],
      this._linkedError,
    );
  }

  public toString(): string {
    return this.toUniversalError().toString();
  }
}

export default DeviceFileIOLsError;
