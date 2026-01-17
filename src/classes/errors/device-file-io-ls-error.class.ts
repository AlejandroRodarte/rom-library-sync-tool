import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

// why would DeviceFileIO.ls() fail?
// 1. because the path is not valid
// 2. because the path is valid, but does not exist
// 3. because the path is valid and exists, but is not a directory
// 4. because we are unauthorized to access it
// 5. becase there was a connecton issue
export const SPECIFIC_ERROR_CODES = [
  "BAD_PATH_ERROR",
  "PATH_DOES_NOT_EXIST_ERROR",
  "NOT_A_DIRECTORY_ERROR",
  "UNAUTHORIZED_ERROR",
  "CONNECTION_ERROR",
  "UNKNOWN_ERROR",
] as const;

export type SpecificErrorCode = (typeof SPECIFIC_ERROR_CODES)[number];

class DeviceFileIOLsError extends CustomError {
  readonly type = "DeviceFileIOLsError";
  readonly status = 400;
  readonly code = "DEVICE_FILE_IO_LS_ERROR";
  readonly message =
    "A problem occured while fetching contents from a device directory.";

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

export default DeviceFileIOLsError;
