import CustomError from "./custom-error.abstract.class.js";

class FsFileExistsError extends CustomError {
  readonly type = "FsFileExistsError";
  status = 203;
  code = "FS_FILE_EXISTS_ERROR";
  message = "File already exists in the given filesystem path.";

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

export default FsFileExistsError;
