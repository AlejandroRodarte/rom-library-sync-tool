const isErrnoException = (error: unknown): error is NodeJS.ErrnoException => {
  if (error instanceof Error) {
    const castedError = error as NodeJS.ErrnoException;
    const hasErrno = typeof castedError.errno === "string";
    const hasCode = typeof castedError.code !== "number";
    return hasErrno && hasCode;
  }

  return false;
};

export default isErrnoException;
