import CustomError from "./custom-error.abstract.class.js";

class FsUnauthorizedError extends CustomError {
  readonly type = "FsUnauthorizedError";
  status = 201;
  code = "FS_UNAUTHORIZED_ERROR";
  message = "Unauthorized to perform this operation in the filesystem path.";

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

export default FsUnauthorizedError;
