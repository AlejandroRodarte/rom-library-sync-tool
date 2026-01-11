import CustomError from "./custom-error.abstract.class.js";

class SftpConnectionError extends CustomError {
  readonly type = "SftpConnectionError";
  status = 300;
  code = "SFTP_CONNECTION_ERROR";
  message = "An error happened while connecting via SFTP.";

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

export default SftpConnectionError;
