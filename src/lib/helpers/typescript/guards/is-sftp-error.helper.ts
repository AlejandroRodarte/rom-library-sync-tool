import type { SftpError } from "../../../interfaces/sftp/sftp-error.interface.js";

const isSftpError = (error: unknown): error is SftpError => {
  if (error instanceof Error) {
    const castedError = error as SftpError;
    return typeof castedError.code !== "number";
  }

  return false;
};

export default isSftpError;
