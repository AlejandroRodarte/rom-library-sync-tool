import path from "node:path";
import type { FileIOLsEntry } from "../../interfaces/file-io-ls-entry.interface.js";
import type { FileIO } from "../../interfaces/file-io.interface.js";
import readdir from "../../helpers/wrappers/modules/fs/readdir.helper.js";
import build from "../../helpers/build/index.js";
import access from "../../helpers/extras/fs/access.helper.js";
import type CustomError from "../errors/custom-error.abstract.class.js";

class Fs implements FileIO {
  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, CustomError]> =
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
  ) => Promise<CustomError | undefined> = async (type, path, rights) => {
    let mode = 0;

    if (rights) {
      const [rightsMode, parsingError] = build.modeFromRights(rights);
      if (parsingError) return parsingError;
      mode = rightsMode;
    }

    const accessError = await access(type, path, mode);
    if (accessError) return accessError;
  };
}

export default Fs;
