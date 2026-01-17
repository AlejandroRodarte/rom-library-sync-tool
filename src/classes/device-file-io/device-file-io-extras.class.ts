import type { DeviceFileIO } from "../../interfaces/device-file-io.interface.js";
import type { PathAccessItem } from "../../interfaces/path-access-item.interface.js";
import type DeviceFileIOExistsError from "../errors/device-file-io-exists-error.class.js";

export type AllExistMethodError = DeviceFileIOExistsError;

class DeviceFileIOExtras {
  private _deviceFileIO: DeviceFileIO;

  constructor(deviceFileIO: DeviceFileIO) {
    this._deviceFileIO = deviceFileIO;
  }

  allExist: (
    pathAccessList: PathAccessItem[],
  ) => Promise<[boolean, undefined] | [undefined, AllExistMethodError]> =
    async (pathAccessList) => {
      let allItemsAreValid = true;

      for (const pathAccessItem of pathAccessList) {
        const { path, type, rights } = pathAccessItem;
        const existsError = await this._deviceFileIO.exists(type, path, rights);

        if (existsError) {
          switch (existsError.specificCode) {
            case "BAD_PATH_ERROR":
            case "BAD_FILE_TYPE_ERROR":
            case "PATH_DOES_NOT_EXIST_ERROR": {
              allItemsAreValid = false;
              break;
            }
            default:
              return [undefined, existsError];
          }
        }

        if (!allItemsAreValid) break;
      }

      return [allItemsAreValid, undefined];
    };
}

export default DeviceFileIOExtras;
