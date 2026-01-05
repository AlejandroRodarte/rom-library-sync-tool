import Client from "ssh2-sftp-client";

const disconnect = async (client: Client): Promise<Error | undefined> => {
  try {
    await client.end();
  } catch (e: unknown) {
    if (e instanceof Error) return e;
    else return new Error("disconnect(): an unknown error has occurred.");
  }
};

export default disconnect;
