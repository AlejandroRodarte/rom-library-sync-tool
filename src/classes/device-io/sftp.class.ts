import path from "node:path";
import type { DeviceFileIOLsEntry } from "../../interfaces/device-file-io-ls-entry.interface.js";
import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import DeviceFileIOLsError from "../errors/device-file-io-ls-error.class.js";
import type SftpClient from "../sftp-client.class.js";
import type DeviceFileIOExistsError from "../errors/device-file-io-exists-error.class.js";

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
      return [undefined, new DeviceFileIOLsError(readDirError.reasons)];

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
    return undefined;
  };
}

export default Sftp;
