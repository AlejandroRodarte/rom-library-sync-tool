import CustomError from "./custom-error.abstract.class.js";

class SftpNotFoundError extends CustomError {
  readonly type = "SftpNotFoundError";
  status = 302;
  code = "SFTP_NOT_FOUND_ERROR";
  message = "The object was not found in the remote filesystem.";

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

export default SftpNotFoundError;
