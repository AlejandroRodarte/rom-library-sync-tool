import CustomError from "./custom-error.abstract.class.js";

class SftpDisconnectionError extends CustomError {
  readonly type = "SftpDisconnectionError";
  status = 301;
  code = "SFTP_DISCONNECTION_ERROR";
  message = "An error happened while disconnecting via SFTP.";

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

export default SftpDisconnectionError;
