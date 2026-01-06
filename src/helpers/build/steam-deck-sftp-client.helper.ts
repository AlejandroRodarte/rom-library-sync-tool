import SftpClient from "../../classes/sftp-client.class.js";
import ENVIRONMENT from "../../constants/environment.constant.js";

const steamDeckSftpClient = async (): Promise<
  [SftpClient, undefined] | [undefined, Error]
> => {
  const sftpClient = new SftpClient("steam-deck");

  const connectError = await sftpClient.connect(
    ENVIRONMENT.devices.steamDeck.sftp.credentials,
  );
  if (connectError) return [undefined, connectError];

  return [sftpClient, undefined];
};

export default steamDeckSftpClient;
