import CustomError from "./custom-error.abstract.class.js";

class FsUnauthorizedError extends CustomError {
  readonly type = "FsUnauthorizedError";
  status = 201;
  code = "FS_UNAUTHORIZED_ERROR";
  message = "Unauthorized to perform this operation in the filesystem path.";

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

export default FsUnauthorizedError;
