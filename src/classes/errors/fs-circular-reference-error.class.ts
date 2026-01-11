import CustomError from "./custom-error.abstract.class.js";

class FsCircularReferenceError extends CustomError {
  readonly type = "FsCircularReferenceError";
  status = 204;
  code = "FS_CIRCULAR_REFERENCE_ERROR";
  message = "The symlink to be created would create a circular reference.";

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

export default FsCircularReferenceError;
