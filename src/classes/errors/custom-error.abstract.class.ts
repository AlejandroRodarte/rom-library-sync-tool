abstract class CustomError extends Error {
  abstract type: string;
  abstract status: number;
  abstract code: string;
  abstract message: string;

  constructor() {
    super();
  }
}

export default CustomError;
