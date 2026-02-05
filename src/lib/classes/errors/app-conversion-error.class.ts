import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class AppConversionError extends CustomError {
  readonly type = "AppConversionError";
  readonly status = 104;
  readonly code = "APP_CONVERSION_ERROR";
  readonly message = "The object in question failed to be converted.";

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

export default AppConversionError;
