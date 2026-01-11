import CustomError from "./custom-error.abstract.class.js";

class UnknownError extends CustomError {
  readonly type = "UnknownError";
  status = 999;
  code = "UNKNOWN_ERROR";
  message = "An unknown error has occured.";

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

export default UnknownError;
