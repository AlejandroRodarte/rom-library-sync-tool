import CustomError from "./custom-error.abstract.class.js";

class SftpConnectionError extends CustomError {
  readonly type = "SftpConnectionError";
  status = 300;
  code = "SFTP_CONNECTION_ERROR";
  message = "An error happened while connecting via SFTP.";

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

export default SftpConnectionError;
