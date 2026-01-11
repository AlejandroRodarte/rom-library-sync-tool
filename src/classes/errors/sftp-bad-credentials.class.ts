import CustomError from "./custom-error.abstract.class.js";

class SftpBadCredentialsError extends CustomError {
  readonly type = "SftpBadCredentialsError";
  status = 306;
  code = "SFTP_BAD_CREDENTIALS_ERROR";
  message = "SFTP credentials lead to a bad authentication procedure.";

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

export default SftpBadCredentialsError;
