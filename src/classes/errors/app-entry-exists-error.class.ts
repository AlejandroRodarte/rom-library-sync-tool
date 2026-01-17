import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class AppEntryExistsError extends CustomError {
  readonly type = "AppEntryExistsError";
  readonly status = 104;
  readonly code = "APP_ENTRY_EXISTS_ERROR";
  readonly message = "There is already an entry in the Map for the given key.";

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

export default AppEntryExistsError;
