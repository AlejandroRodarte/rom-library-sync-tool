import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class FsCircularReferenceError extends CustomError {
  readonly type = "FsCircularReferenceError";
  readonly status = 204;
  readonly code = "FS_CIRCULAR_REFERENCE_ERROR";
  readonly message =
    "The symlink to be created would create a circular reference.";

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

export default FsCircularReferenceError;
