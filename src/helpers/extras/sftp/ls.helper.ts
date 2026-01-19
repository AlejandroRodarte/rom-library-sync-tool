import path from "path";
import Client from "ssh2-sftp-client";

import type { FileIOLsEntry } from "../../../interfaces/file-io-ls-entry.interface.js";
import list, {
  type ListError,
} from "../../wrappers/modules/ssh2-sftp-client/list.helper.js";

export type LsError = ListError;

const ls = async (
  client: Client,
  dirPath: string,
): Promise<[FileIOLsEntry[], undefined] | [undefined, LsError]> => {
  const [dirEntries, readDirError] = await list(client, dirPath);

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

export default ls;
