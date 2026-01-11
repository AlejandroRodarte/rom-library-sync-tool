import CustomError from "./custom-error.abstract.class.js";

class SftpBadPathError extends CustomError {
  readonly type = "SftpBadPathError";
  status = 304;
  code = "SFTP_BAD_PATH_ERROR";
  message = "The remote path that was provided is faulty.";

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

export default SftpBadPathError;
