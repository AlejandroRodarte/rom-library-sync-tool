import CustomError from "./custom-error.abstract.class.js";

class FsCircularReferenceError extends CustomError {
  readonly type = "FsCircularReferenceError";
  status = 204;
  code = "FS_CIRCULAR_REFERENCE_ERROR";
  message = "The symlink to be created would create a circular reference.";

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

export default FsCircularReferenceError;
