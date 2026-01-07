import CustomError from "./custom-error.abstract.class.js";

class FsNotFoundError extends CustomError {
  readonly type = "FsNotFoundError";
  status = 200;
  code = "FS_NOT_FOUND_ERROR";
  message = "The object was not found in the filesystem path.";

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

export default FsNotFoundError;
