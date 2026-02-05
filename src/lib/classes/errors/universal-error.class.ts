class UniversalError {
  private _type: string;
  private _messages: string[];
  private _linkedError: UniversalError | undefined;

  constructor(type: string, messages: string[], linkedError?: UniversalError) {
    this._type = type;
    this._messages = messages;
    if (linkedError) this._linkedError = linkedError;
  }

  set linkedError(linkedError: UniversalError) {
    this._linkedError = linkedError;
  }

  public toString(): string {
    let content = "";

    content += `${this._type} { `;
    content += `messages: ${this._messages.join(", ")} }\n`;

    let linkedError = this._linkedError;
    let tabs = "\t";

    while (typeof linkedError !== "undefined") {
      content += `${tabs}${linkedError._type} { `;
      content += `messages: ${linkedError._messages.join(", ")} }\n`;

      tabs += "\t";

      linkedError = linkedError._linkedError;
    }

    return content;
  }
}

export default UniversalError;
