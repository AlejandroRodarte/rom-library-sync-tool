import CustomError from "./custom-error.abstract.class.js";

class UnknownError extends CustomError {
  readonly type = "UnknownError";
  readonly status = 999;
  readonly code = "UNKNOWN_ERROR";
  readonly message = "An unknown error has occured.";

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

export default UnknownError;
