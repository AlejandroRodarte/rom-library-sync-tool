import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

// why would DeviceFileIO.exists() fail?
// 1. because the path is not valid
// 2. because the path is valid, but does not exist
// 3. because the path exists, but is not of the correct type (file|dir|link)
// 4. because we are unauthorized to access the path
// 5. because there was a problem parsing the `rights` parameter
// 6. because there was a connection issue
export const SPECIFIC_ERROR_CODES = [
  "BAD_PATH_ERROR",
  "PATH_DOES_NOT_EXIST_ERROR",
  "BAD_FILE_TYPE_ERROR",
  "UNAUTHORIZED_ERROR",
  "RIGHTS_VALIDATION_ERROR",
  "CONNECTION_ERROR",
  "UNKNOWN_ERROR",
];

export type SpecificErrorCode = (typeof SPECIFIC_ERROR_CODES)[number];

class DeviceFileIOExistsError extends CustomError {
  readonly type = "DeviceFileIOExistsError";
  readonly status = 401;
  readonly code = "DEVICE_FILE_IO_EXISTS_ERROR";
  readonly message =
    "A problem occured while confirming the existence of a file|dir|link in the requested path.";

  private _reason: string;
  private _linkedError: UniversalError | undefined;

  private _specificCode: SpecificErrorCode;

  constructor(
    reason: string,
    specificCode: SpecificErrorCode,
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

  get specificCode(): SpecificErrorCode {
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
