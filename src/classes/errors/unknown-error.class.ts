import CustomError from "./custom-error.abstract.class.js";

class UnknownError extends CustomError {
  readonly type = "UnknownError";
  status = 999;
  code = "UNKNOWN_ERROR";
  message = "An unknown error has occured.";

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

export default UnknownError;
