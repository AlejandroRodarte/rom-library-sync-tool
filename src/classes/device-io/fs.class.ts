import path from "node:path";
import readdir from "../../helpers/file-io/readdir.helper.js";
import type { DeviceFileIOLsEntry } from "../../interfaces/device-file-io-ls-entry.interface.js";
import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import DeviceFileIOLsError from "../errors/device-file-io-ls-error.class.js";

class Fs implements DeviceFileIO {
  ls: (
    dirPath: string,
  ) => Promise<
    [DeviceFileIOLsEntry[], undefined] | [undefined, DeviceFileIOLsError]
  > = async (dirPath: string) => {
    const [dirEntries, readDirError] = await readdir([
      dirPath,
      { withFileTypes: true, encoding: "buffer" },
    ]);

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
}

export default Fs;
