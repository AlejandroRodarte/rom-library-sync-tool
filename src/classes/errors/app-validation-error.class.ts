import CustomError from "./custom-error.abstract.class.js";

class AppValidationError extends CustomError {
  readonly type = "AppValidationError";
  status = 101;
  code = "APP_VALIDATION_ERROR";
  message = "The object in question failed validation criteria.";

  private _reasons: string[];

  constructor(reason: string) {
    super();
    this._reasons = [reason];
  }

  get reasons(): string[] {
    return this._reasons;
  }

  public addReason(reason: string): void {
    this._reasons.push(reason);
  }
}

export default AppValidationError;
