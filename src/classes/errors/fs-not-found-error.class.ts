import CustomError from "./custom-error.abstract.class.js";

class FsNotFoundError extends CustomError {
  readonly type = "FsNotFoundError";
  status = 200;
  code = "FS_NOT_FOUND_ERROR";
  message = "The object was not found in the filesystem path.";

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

export default FsNotFoundError;
