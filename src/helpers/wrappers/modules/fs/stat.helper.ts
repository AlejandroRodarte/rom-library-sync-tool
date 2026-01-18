import fs from "node:fs/promises";
import typeGuards from "../../../typescript/guards/index.js";
import UnknownError from "../../../../classes/errors/unknown-error.class.js";
import FileIONotFoundError from "../../../../classes/errors/file-io-not-found-error.class.js";
import FileIOUnauthorizedError from "../../../../classes/errors/file-io-unauthorized-error.class.js";

export type StatError = UnknownError | FileIONotFoundError | FileIOUnauthorizedError;

const stat = async (
  ...args: Parameters<typeof fs.stat>
): Promise<
  [Awaited<ReturnType<typeof fs.stat>>, undefined] | [undefined, StatError]
> => {
  const [path] = args;
  try {
    const stats = await fs.stat(...args);
    return [stats, undefined];
  } catch (e: unknown) {
    if (!typeGuards.isErrnoException(e))
      return [
        undefined,
        new UnknownError(
          `An unknown error was thrown while calling the stats() function with path argument ${path}.`,
        ),
      ];

    switch (e.code) {
      case "ENOENT":
        return [
          undefined,
          new FileIONotFoundError(`Item not found at path ${path}.`),
        ];
      case "EACCES":
      case "EPERM":
        return [
          undefined,
          new FileIOUnauthorizedError(
            `Can not compute statistics for path ${path} because this process is not authorized to do so.`,
          ),
        ];
      default:
        return [
          undefined,
          new UnknownError(
            `Something bad happened while fetching statistics. Error code: ${e.code}`,
          ),
        ];
    }
  }
};

export default stat;
