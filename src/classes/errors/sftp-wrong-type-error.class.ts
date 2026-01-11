import CustomError from "./custom-error.abstract.class.js";

class SftpWrongTypeError extends CustomError {
  readonly type = "SftpWrongTypeError";
  status = 303;
  code = "SFTP_WRONG_TYPE_ERROR";
  message = "The object found in the remote filesystem is of the wrong type.";

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

export default SftpWrongTypeError;
