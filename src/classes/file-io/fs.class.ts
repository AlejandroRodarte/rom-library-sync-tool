import path from "node:path";
import type { FileIOLsEntry } from "../../interfaces/file-io-ls-entry.interface.js";
import type { FileIO, FileIOAddMethodError, FileIODeleteMethodError, FileIOExistsMethodError, FileIOLsMethodError } from "../../interfaces/file-io.interface.js";
import readdir from "../../helpers/wrappers/modules/fs/readdir.helper.js";
import build from "../../helpers/build/index.js";
import access from "../../helpers/extras/fs/access.helper.js";

class Fs implements FileIO {
  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, FileIOLsMethodError]> =
    async (dirPath: string) => {
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

  exists: (
    type: "file" | "dir" | "link",
    path: string,
    rights?: "r" | "w" | "rw",
  ) => Promise<FileIOExistsMethodError | undefined> = async (type, path, rights) => {
    let mode = 0;

    if (rights) {
      const [rightsMode, parsingError] = build.modeFromRights(rights);
      if (parsingError) return parsingError;
      mode = rightsMode;
    }

    const accessError = await access(type, path, mode);
    if (accessError) return accessError;
  };

  add: (type: "file" | "dir", srcPath: string, dstPath: string) => Promise<FileIOAddMethodError | undefined> = async (type, srcPath, dstPath) => {
    return undefined;
  }
  delete: (type: "file" | "dir", path: string) => Promise<FileIODeleteMethodError | undefined> = async (type, path) => { return undefined; }
}

export default Fs;
