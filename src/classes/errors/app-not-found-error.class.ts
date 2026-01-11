import CustomError from "./custom-error.abstract.class.js";

class AppNotFoundError extends CustomError {
  readonly type = "AppNotFoundError";
  status = 100;
  code = "APP_NOT_FOUND_ERROR";
  message = "The object was not found in app memory.";

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

export default AppNotFoundError;
