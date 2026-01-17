import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class SftpWrongTypeError extends CustomError {
  readonly type = "SftpWrongTypeError";
  readonly status = 303;
  readonly code = "SFTP_WRONG_TYPE_ERROR";
  readonly message =
    "The object found in the remote filesystem is of the wrong type.";
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

export default SftpWrongTypeError;
