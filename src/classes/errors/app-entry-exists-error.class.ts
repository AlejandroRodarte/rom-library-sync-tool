import CustomError from "./custom-error.abstract.class.js";

class AppEntryExistsError extends CustomError {
  readonly type = "AppEntryExistsError";
  status = 104;
  code = "APP_ENTRY_EXISTS_ERROR";
  message = "There is already an entry in the Map for the given key.";

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

export default AppEntryExistsError;
