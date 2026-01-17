import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class AppWrongTypeError extends CustomError {
  readonly type = "AppWrongTypeError";
  readonly status = 102;
  readonly code = "APP_WRONG_TYPE_ERROR";
  readonly message = "The object in question failed a type check.";

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

export default AppWrongTypeError;
