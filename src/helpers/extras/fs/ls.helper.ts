import path from "path";
import type { FileIOLsEntry } from "../../../interfaces/file-io-ls-entry.interface.js";
import readdir, {
  type ReaddirError,
} from "../../wrappers/modules/fs/readdir.helper.js";

export type LsError = ReaddirError;

const ls = async (
  dirPath: string,
): Promise<[FileIOLsEntry[], undefined] | [undefined, LsError]> => {
  const [dirEntries, readDirError] = await readdir(dirPath, {
    withFileTypes: true,
    encoding: "buffer",
  });

  if (readDirError) return [undefined, readDirError];

  const lsEntries: FileIOLsEntry[] = dirEntries.map((d) => {
    const name = d.name.toString();

    return {
      name,
      path: path.join(dirPath, name),
      is: {
        file: d.isFile(),
        dir: d.isDirectory(),
        link: d.isSymbolicLink(),
      },
    };
  });

  return [lsEntries, undefined];
};

export default ls;
