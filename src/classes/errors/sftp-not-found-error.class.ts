import CustomError from "./custom-error.abstract.class.js";

class SftpNotFoundError extends CustomError {
  readonly type = "SftpNotFoundError";
  status = 302;
  code = "SFTP_NOT_FOUND_ERROR";
  message = "The object was not found in the remote filesystem.";

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

export default SftpNotFoundError;
