import CustomError from "./custom-error.abstract.class.js";

class AppWrongTypeError extends CustomError {
  readonly type = "AppWrongTypeError";
  status = 102;
  code = "APP_WRONG_TYPE_ERROR";
  message = "The object in question failed a type check.";

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

export default AppWrongTypeError;
