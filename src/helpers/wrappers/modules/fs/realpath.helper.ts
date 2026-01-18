import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOCircularReferenceError from "../../../../classes/errors/file-io-circular-reference-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";

export type RealpathError =
  | UnknownError
  | FileIONotFoundError
  | FileIOUnauthorizedError
  | FileIOCircularReferenceError;

const realpath = async (
  ...args: Parameters<typeof fs.realpath>
): Promise<
  | [Awaited<ReturnType<typeof fs.realpath>>, undefined]
  | [undefined, RealpathError]
> => {
  const [path] = args;

  try {
    const realPath = await fs.realpath(...args);
    return [realPath, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error happened while trying to access the real path of link at ${path}.`,
        ),
      ];

    switch (e.code) {
      case "ENOENT":
        return [
          undefined,
          new FileIONotFoundError(
            `Path ${path} does not exist. Original error message.`,
          ),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `This process is not authorized to get the real path of link at ${path}.`,
          ),
        ];
      case "ELOOP":
        return [
          undefined,
          new FileIOCircularReferenceError(
            `Link at ${path} is a circular symbolic link. Delete it.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something went wrong while accessing the real path of link at ${path}. Error code: ${e.code}. Error message: ${e.message}.`,
          ),
        ];
    }
  }
};

export default realpath;
