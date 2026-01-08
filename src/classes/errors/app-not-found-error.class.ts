import CustomError from "./custom-error.abstract.class.js";

class AppNotFoundError extends CustomError {
  readonly type = "AppNotFoundError";
  status = 100;
  code = "APP_NOT_FOUND_ERROR";
  message = "The object was not found in app memory.";

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

export default AppNotFoundError;
