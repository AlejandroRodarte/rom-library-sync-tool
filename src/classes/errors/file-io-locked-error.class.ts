import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class FileIOLockedError extends CustomError {
  readonly type = "FileIOLockedError";
  readonly status = 209;
  readonly code = "FILE_IO_LOCKED_ERROR";
  readonly message =
    "One of the files that is part of the I/O process is locked by another process.";

  private _reason: string;
  private _linkedError: UniversalError | undefined;

  constructor(reason: string, linkedError?: UniversalError) {
    super();
    this._reason = reason;
    if (linkedError) this._linkedError = linkedError;
  }

  get reason(): string {
    return this._reason;
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

export default FileIOLockedError;
