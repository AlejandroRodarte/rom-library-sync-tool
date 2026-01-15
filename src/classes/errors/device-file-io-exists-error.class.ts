import CustomError from "./custom-error.abstract.class.js";

class DeviceFileIOExistsError extends CustomError {
  readonly type = "DeviceFileIOExistsError";
  status = 401;
  code = "DEVICE_FILE_IO_EXISTS_ERROR";
  message =
    "A problem occured while confirming the existence of a file|dir|link in the requested path.";

  private _reasons: string[];

  constructor(reasons: string[]) {
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

export default DeviceFileIOExistsError;
