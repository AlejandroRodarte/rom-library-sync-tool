import type { PathLike } from "node:fs";
import type { FileHandle } from "node:fs/promises";
import open, { type OpenError } from "../../wrappers/modules/fs/open.helper.js";

export type OpenFileForWritingError = OpenError;

export interface OpenFileForWritingOpts {
  overwrite?: boolean;
}

const openFileForWriting = async (
  filePath: PathLike,
  opts?: OpenFileForWritingOpts,
): Promise<[FileHandle, undefined] | [undefined, OpenFileForWritingError]> => {
  const openFileForWritingOpts: Required<OpenFileForWritingOpts> = {
    overwrite: true,
  };

  if (opts)
    if (typeof opts.overwrite === "boolean")
      openFileForWritingOpts.overwrite = opts.overwrite;

  const [handle, openError] = await open(
    filePath,
    openFileForWritingOpts.overwrite ? "w" : "wx",
  );
  if (openError) return [undefined, openError];
  return [handle, undefined];
};

export default openFileForWriting;
