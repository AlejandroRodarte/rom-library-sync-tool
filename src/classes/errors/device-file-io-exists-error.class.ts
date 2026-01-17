import type { DeviceFileIOExistsMethodSpecificErrorCode } from "../../types/interfaces/device-file-io/device-file-io-exists-method-specific-error-code.type.js";
import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class DeviceFileIOExistsError extends CustomError {
  readonly type = "DeviceFileIOExistsError";
  readonly status = 401;
  readonly code = "DEVICE_FILE_IO_EXISTS_ERROR";
  readonly message =
    "A problem occured while confirming the existence of a file|dir|link in the requested path.";

  private _reason: string;
  private _linkedError: UniversalError | undefined;

  private _specificCode: DeviceFileIOExistsMethodSpecificErrorCode;

  constructor(
    reason: string,
    specificCode: DeviceFileIOExistsMethodSpecificErrorCode,
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

  get specificCode(): DeviceFileIOExistsMethodSpecificErrorCode {
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

export default DeviceFileIOExistsError;
