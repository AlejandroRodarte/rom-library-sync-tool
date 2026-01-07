import CustomError from "./custom-error.abstract.class.js";

class FsFileExistsError extends CustomError {
  readonly type = "FsFileExistsError";
  status = 203;
  code = "FS_FILE_EXISTS_ERROR";
  message = "File already exists in the given filesystem path.";

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

export default FsFileExistsError;
