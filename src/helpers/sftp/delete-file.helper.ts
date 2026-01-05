import Client from "ssh2-sftp-client";

const deleteFile = async (
  client: Client,
  remoteFilePath: string,
  fileMustExist = false,
): Promise<Error | undefined> => {
  try {
    await client.delete(remoteFilePath, fileMustExist);
  } catch (e: unknown) {
    if (e instanceof Error) return e;
    else return new Error("deleteFile(): an unknown error has happened.");
  }
};

export default deleteFile;
