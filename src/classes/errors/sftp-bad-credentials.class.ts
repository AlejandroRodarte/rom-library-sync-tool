import CustomError from "./custom-error.abstract.class.js";

class SftpBadCredentialsError extends CustomError {
  readonly type = "SftpBadCredentialsError";
  status = 306;
  code = "SFTP_BAD_CREDENTIALS_ERROR";
  message = "SFTP credentials lead to a bad authentication procedure.";

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

export default SftpBadCredentialsError;
