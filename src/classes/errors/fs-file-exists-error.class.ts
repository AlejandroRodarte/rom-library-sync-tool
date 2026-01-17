import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class FsFileExistsError extends CustomError {
  readonly type = "FsFileExistsError";
  readonly status = 203;
  readonly code = "FS_FILE_EXISTS_ERROR";
  readonly message = "File already exists in the given filesystem path.";

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

export default FsFileExistsError;
