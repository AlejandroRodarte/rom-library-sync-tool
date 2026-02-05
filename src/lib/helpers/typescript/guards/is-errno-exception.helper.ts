const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  if (error instanceof Error) {
    const castedError = error as NodeJS.ErrnoException;
    const hasErrno = typeof castedError.errno === "number";
    const hasCode = typeof castedError.code === "string";
    return hasErrno && hasCode;
  }

  return false;
};

export default isErrnoException;
