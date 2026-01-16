import CustomError from "./custom-error.abstract.class.js";

class FsNotFoundError extends CustomError {
  readonly type = "FsNotFoundError";
  readonly status = 200;
  readonly code = "FS_NOT_FOUND_ERROR";
  readonly message = "The object was not found in the filesystem path.";

  private _reasons: string[];

  constructor(...reasons: string[]) {
    super();
    this._reasons = reasons;
  }

  get reasons(): string[] {
    return this._reasons;
  }

  public addReason(reason: string): void {
    this._reasons.push(reason);
  }

  public toString(): string {
    let content = "";

    content += `!!!!! Error !!!!!\n`;
    content += `Type: ${this.type}\n`;
    content += `Status code: ${this.status}\n`;
    content += `Code: ${this.code}.\n`;
    content += `Message: ${this.message}\n`;

    content += `Reasons:\n`;
    for (const reason of this._reasons) content += `${reason}\n`;

    return content;
  }
}

export default FsNotFoundError;
