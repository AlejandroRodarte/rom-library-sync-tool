import type UniversalError from "./universal-error.class.js";

abstract class CustomError extends Error {
  abstract type: string;
  abstract status: number;
  abstract code: string;
  abstract message: string;

  constructor() {
    super();
  }

  abstract toUniversalError(): UniversalError;
}

export default CustomError;
