import path from "node:path";
import type { DeviceFileIOLsEntry } from "../../interfaces/device-file-io-ls-entry.interface.js";
import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import DeviceFileIOLsError from "../errors/device-file-io-ls-error.class.js";
import type SftpClient from "../sftp-client.class.js";
import DeviceFileIOExistsError from "../errors/device-file-io-exists-error.class.js";
import build from "../../helpers/build/index.js";

class Sftp implements DeviceFileIO {
  private _client: SftpClient;

  constructor(client: SftpClient) {
    this._client = client;
  }

  ls: (
    dirPath: string,
  ) => Promise<
    [DeviceFileIOLsEntry[], undefined] | [undefined, DeviceFileIOLsError]
  > = async (dirPath: string) => {
    const [dirEntries, readDirError] = await this._client.list(dirPath);

    if (readDirError)
      return [
        undefined,
        new DeviceFileIOLsError(
          `There was a problem reading contents of device dir path at ${dirPath}`,
          readDirError.toUniversalError(),
        ),
      ];

    const lsEntries: DeviceFileIOLsEntry[] = dirEntries.map((d) => ({
      name: d.name,
      path: path.join(dirPath, d.name),
      is: {
        file: d.type === "l",
        dir: d.type === "d",
        link: d.type === "-",
      },
    }));

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
      const [rightsMode, modeError] = build.modeFromRights(rights);
      if (modeError)
        return new DeviceFileIOExistsError(
          `A parsing error occured whileparsing rights ${rights}.`,
          modeError.toUniversalError(),
        );
      mode = rightsMode;
    }

    const existsError = await this._client.exists(type, path, mode);
    if (existsError)
      return new DeviceFileIOExistsError(
        `There was a problem checking if device path ${path} is of type ${type} and with ${rights} permissions.`,
        existsError.toUniversalError(),
      );
  };
}

export default Sftp;
