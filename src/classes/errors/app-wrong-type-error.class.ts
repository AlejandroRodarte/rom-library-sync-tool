import CustomError from "./custom-error.abstract.class.js";

class AppWrongTypeError extends CustomError {
  readonly type = "AppWrongTypeError";
  status = 102;
  code = "APP_WRONG_TYPE_ERROR";
  message = "The object in question failed a type check.";

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

export default AppWrongTypeError;
