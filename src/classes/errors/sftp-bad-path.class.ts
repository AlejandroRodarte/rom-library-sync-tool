import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class SftpBadPathError extends CustomError {
  readonly type = "SftpBadPathError";
  readonly status = 304;
  readonly code = "SFTP_BAD_PATH_ERROR";
  readonly message = "The remote path that was provided is faulty.";

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

export default SftpBadPathError;
