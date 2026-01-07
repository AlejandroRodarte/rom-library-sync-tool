import CustomError from "./custom-error.abstract.class.js";

class SftpWrongTypeError extends CustomError {
  readonly type = "SftpWrongTypeError";
  status = 303;
  code = "SFTP_WRONG_TYPE_ERROR";
  message = "The object found in the remote filesystem is of the wrong type.";

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

export default SftpWrongTypeError;
