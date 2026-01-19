import SftpClient from "../../classes/sftp-client.class.js";
import environment from "../../objects/environment.object.js";

const steamDeckSftpClient = async (): Promise<SftpClient> => {
  await using sftpClient = new SftpClient(
    "steam-deck",
    environment.device.data[
      "steam-deck-lcd-alejandro"
    ].fileIO.data.sftp.credentials,
  );

  return sftpClient;
};

export default steamDeckSftpClient;
