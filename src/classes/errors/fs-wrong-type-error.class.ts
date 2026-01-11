import CustomError from "./custom-error.abstract.class.js";

class FsWrongTypeError extends CustomError {
  readonly type = "FsWrongTypeError";
  status = 202;
  code = "FS_WRONG_TYPE_ERROR";
  message = "The object found in the filesystem path is of the wrong type.";

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

export default FsWrongTypeError;
