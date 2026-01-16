import path from "node:path";
import type { DeviceFileIOLsEntry } from "../../interfaces/device-file-io-ls-entry.interface.js";
import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import DeviceFileIOLsError from "../errors/device-file-io-ls-error.class.js";
import DeviceFileIOExistsError from "../errors/device-file-io-exists-error.class.js";
import readdir from "../../helpers/wrappers/modules/fs/readdir.helper.js";
import build from "../../helpers/build/index.js";
import access from "../../helpers/file-io/access.helper.js";

class Fs implements DeviceFileIO {
  ls: (
    dirPath: string,
  ) => Promise<
    [DeviceFileIOLsEntry[], undefined] | [undefined, DeviceFileIOLsError]
  > = async (dirPath: string) => {
    const [dirEntries, readDirError] = await readdir(dirPath, {
      withFileTypes: true,
      encoding: "buffer",
    });

    if (readDirError)
      return [undefined, new DeviceFileIOLsError(readDirError.reasons)];

    const lsEntries: DeviceFileIOLsEntry[] = dirEntries.map((d) => {
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
  ) => Promise<DeviceFileIOExistsError | undefined> = async (
    type,
    path,
    rights,
  ) => {
    let mode = 0;

    if (rights) {
      const [rightsMode, parsingError] = build.modeFromRights(rights);
      if (parsingError)
        return new DeviceFileIOExistsError(parsingError.reasons);
      mode = rightsMode;
    }

    const accessPathError = await access(type, path, mode);
    if (accessPathError)
      return new DeviceFileIOExistsError(accessPathError.reasons);
  };
}

export default Fs;
