import path from "node:path";
import type { DeviceFileIOLsEntry } from "../../interfaces/device-file-io-ls-entry.interface.js";
import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import DeviceFileIOExistsError from "../errors/device-file-io-exists-error.class.js";
import readdir from "../../helpers/wrappers/modules/fs/readdir.helper.js";
import build from "../../helpers/build/index.js";
import DeviceFileIOLsError from "../errors/device-file-io-ls-error.class.js";
import deviceFileIOFsExistsMethodSpecificErrorCodeDictionary from "../../dictionaries/interfaces/device-file-io/implementors/fs/device-file-io-fs-exists-method-specific-error-code-dictionary.dictionary.js";
import deviceFileIOFsLsMethodSpecificErrorCodeDictionary from "../../dictionaries/interfaces/device-file-io/implementors/fs/device-file-io-fs-ls-method-specific-error-code-dictionary.dictionary.js";
import access from "../../helpers/extras/fs/access.helper.js";

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
      return [
        undefined,
        new DeviceFileIOLsError(
          `There was a problem reading contents of device dir path at ${dirPath}`,
          deviceFileIOFsLsMethodSpecificErrorCodeDictionary[readDirError.code],
          readDirError.toUniversalError(),
        ),
      ];

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
        return new DeviceFileIOExistsError(
          `A parsing error occured whileparsing rights ${rights}.`,
          deviceFileIOFsExistsMethodSpecificErrorCodeDictionary[
            parsingError.code
          ],
          parsingError.toUniversalError(),
        );
      mode = rightsMode;
    }

    const accessError = await access(type, path, mode);
    if (accessError)
      return new DeviceFileIOExistsError(
        `There was a problem checking if device path ${path} is of type ${type} and with ${rights} permissions.`,
        deviceFileIOFsExistsMethodSpecificErrorCodeDictionary[accessError.code],
        accessError.toUniversalError(),
      );
  };
}

export default Fs;
