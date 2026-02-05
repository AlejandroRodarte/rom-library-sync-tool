import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class FileIONotEmptyError extends CustomError {
  readonly type = "FileIONotEmptyError";
  readonly status = 211;
  readonly code = "FILE_IO_NOT_EMPTY_ERROR";
  readonly message = "The resource in the given path is not empty";

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

export default FileIONotEmptyError;
