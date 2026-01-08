import CustomError from "./custom-error.abstract.class.js";

class AppEntryExistsError extends CustomError {
  readonly type = "AppEntryExistsError";
  status = 104;
  code = "APP_ENTRY_EXISTS_ERROR";
  message = "There is already an entry in the Map for the given key.";

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

export default AppEntryExistsError;
