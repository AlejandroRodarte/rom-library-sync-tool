import CustomError from "./custom-error.abstract.class.js";

class SftpBadPathError extends CustomError {
  readonly type = "SftpBadPathError";
  status = 304;
  code = "SFTP_BAD_PATH_ERROR";
  message = "The remote path that was provided is faulty.";

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

export default SftpBadPathError;
