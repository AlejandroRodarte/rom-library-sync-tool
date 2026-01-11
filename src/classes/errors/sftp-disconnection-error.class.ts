import CustomError from "./custom-error.abstract.class.js";

class SftpDisconnectionError extends CustomError {
  readonly type = "SftpDisconnectionError";
  status = 301;
  code = "SFTP_DISCONNECTION_ERROR";
  message = "An error happened while disconnecting via SFTP.";

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

export default SftpDisconnectionError;
