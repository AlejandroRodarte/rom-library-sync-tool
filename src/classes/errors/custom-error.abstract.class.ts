import type { ErrorCodeName } from "../../types/error-code-name.type.js";
import type { ErrorTypeName } from "../../types/error-type-name.type.js";

abstract class CustomError extends Error {
  abstract type: ErrorTypeName;
  abstract status: number;
  abstract code: ErrorCodeName;
  abstract message: string;

  constructor() {
    super();
  }
}

export default CustomError;
