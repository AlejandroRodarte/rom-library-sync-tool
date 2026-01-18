import path from "node:path";
import type { FileIOLsEntry } from "../../interfaces/file-io-ls-entry.interface.js";
import type {
  FileIO,
  AddMethodError,
  DeleteMethodError,
  ExistsMethodError,
  LsMethodError,
} from "../../interfaces/file-io.interface.js";
import type SftpClient from "../sftp-client.class.js";
import build from "../../helpers/build/index.js";

class Sftp implements FileIO {
  private _client: SftpClient;

  constructor(client: SftpClient) {
    this._client = client;
  }

  ls: (
    dirPath: string,
  ) => Promise<[FileIOLsEntry[], undefined] | [undefined, LsMethodError]> =
    async (dirPath: string) => {
      const [dirEntries, readDirError] = await this._client.list(dirPath);

      if (readDirError) return [undefined, readDirError];

      const lsEntries: FileIOLsEntry[] = dirEntries.map((d) => ({
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
  ) => Promise<ExistsMethodError | undefined> = async (type, path, rights) => {
    let mode = 0;

    if (rights) {
      const [rightsMode, modeError] = build.modeFromRights(rights);
      if (modeError) return modeError;
      mode = rightsMode;
    }

    const existsError = await this._client.exists(type, path, mode);
    if (existsError) return existsError;
  };

  add: (
    type: "file" | "dir",
    srcPath: string,
    dstPath: string,
  ) => Promise<AddMethodError | undefined> = async (type, srcPath, dstPath) => {
    return undefined;
  };
  delete: (
    type: "file" | "dir",
    path: string,
  ) => Promise<DeleteMethodError | undefined> = async (type, path) => {
    return undefined;
  };
}

export default Sftp;
