import CustomError from "./custom-error.abstract.class.js";

class FsWrongTypeError extends CustomError {
  readonly type = "FsWrongTypeError";
  status = 202;
  code = "FS_WRONG_TYPE_ERROR";
  message = "The object found in the filesystem path is of the wrong type.";

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

export default FsWrongTypeError;
