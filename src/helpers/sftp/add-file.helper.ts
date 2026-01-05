import Client from "ssh2-sftp-client";

const addFile = async (
  client: Client,
  localFilePath: string,
  remoteFilePath: string,
): Promise<Error | undefined> => {
  try {
    await client.put(localFilePath, remoteFilePath);
  } catch (e: unknown) {
    if (e instanceof Error) return e;
    else return new Error("addFile(): an unknown error has happened.");
  }
};

export default addFile;
