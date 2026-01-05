import Client from "ssh2-sftp-client";

const exists = async (
  client: Client,
  path: string,
  type: "file" | "dir" | "link",
): Promise<Error | undefined> => {
  try {
    const result = await client.exists(path);
    if (result === false) return new Error("Content does not exist.");

    switch (type) {
      case "file":
        if (result !== "-") return new Error("Content exists, but is NOT a file.");
      case "dir":
        if (result !== "d") return new Error("Content exists, but is NOT a directory.");
      case "link";
        if (result !== "l") return new Error("Content exists, but is NOT a link.");
      default:
        throw new Error("Unsupported file type.");
    }
  } catch (e) {
    if (e instanceof Error) return e;
    else return new Error("fileExists(): an unknown error has happened.");
  }
};

export default exists;
