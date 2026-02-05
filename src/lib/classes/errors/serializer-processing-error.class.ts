import CustomError from "./custom-error.abstract.class.js";
import UniversalError from "./universal-error.class.js";

class SerializerProcessingError extends CustomError {
  readonly type = "SerializerProcessingError";
  readonly status = 400;
  readonly code = "SERIALIZER_PROCESSING_ERROR";
  readonly message = "The object in question failed to get serialized.";

  private _reason: string;
  private _linkedError: UniversalError | undefined;

  constructor(reason: string, linkedError?: UniversalError) {
    super();
    this._reason = reason;
    if (linkedError) this._linkedError = linkedError;
  }

  get reason(): string {
    return this._reason;
  }

  public toUniversalError(): UniversalError {
    return new UniversalError(
      this.type,
      [this.message, this._reason],
      this._linkedError,
    );
  }

  public toString(): string {
    return this.toUniversalError().toString();
  }
}

export default SerializerProcessingError;
