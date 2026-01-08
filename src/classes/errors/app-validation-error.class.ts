import CustomError from "./custom-error.abstract.class.js";

class AppValidationError extends CustomError {
  readonly type = "AppValidationError";
  status = 101;
  code = "APP_VALIDATION_ERROR";
  message = "The object in question failed validation criteria.";

  private _reason: string;

  constructor(reason: string) {
    super();
    this._reason = reason;
  }

  get reason(): string {
    return this._reason;
  }

  set reason(reason: string) {
    this._reason = reason;
  }
}

export default AppValidationError;
