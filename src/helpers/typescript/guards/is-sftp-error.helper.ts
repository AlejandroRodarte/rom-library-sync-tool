import type { SftpError } from "../../../types.js";

const isSftpError = (error: unknown): error is SftpError => {
  if (error instanceof Error) {
    const castedError = error as SftpError;
    return typeof castedError.code !== "number";
  }

  return false;
};

export default isSftpError;
