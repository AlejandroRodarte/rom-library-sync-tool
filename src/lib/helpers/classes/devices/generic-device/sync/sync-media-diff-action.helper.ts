import path from "path";
import exists, {
  type ExistsError,
  type ExistsFalseResult,
} from "../../../../extras/fs/exists.helper.js";
import type {
  AddDirPayload,
  AddFilePayload,
  AddFileTypePayload,
  AddMethodError,
  DeleteDirPayload,
  DeleteFilePayload,
  DeleteMethodError,
  FileIO,
} from "../../../../../interfaces/file-io.interface.js";
import environment from "../../../../../objects/environment.object.js";
import logger from "../../../../../objects/logger.object.js";
import { DIR, FILE } from "../../../../../constants/fs/fs-types.constants.js";
import { READ } from "../../../../../constants/rights/rights.constants.js";
import type { MediaDiffAction } from "../../../../../types/classes/devices/generic-device/media/media-diff-action.type.js";
import {
  ADD_MEDIA,
  DELETE_MEDIA,
} from "../../../../../constants/media/media-diff-action-types.constants.js";

const fsExtras = {
  exists,
};

export type SyncMediaDiffActionError =
  | ExistsError
  | ExistsFalseResult["error"]
  | AddMethodError
  | DeleteMethodError;

const syncMediaDiffAction = async (
  mediaDiffAction: MediaDiffAction,
  paths: { db: string; device: string },
  fileIO: FileIO,
): Promise<SyncMediaDiffActionError | undefined> => {
  const deviceMediaPath = path.join(
    paths.device,
    mediaDiffAction.data.filename,
  );

  switch (mediaDiffAction.type) {
    case ADD_MEDIA: {
      const dbMediaPath = path.join(paths.db, mediaDiffAction.data.filename);

      const [existsResult, existsError] = await fsExtras.exists(
        mediaDiffAction.data.fs.type,
        dbMediaPath,
        READ,
      );

      if (existsError) return existsError;
      if (!existsResult.exists) return existsResult.error;

      const commonArgs: Omit<AddFileTypePayload, "type" | "opts"> = {
        srcPath: dbMediaPath,
        dstPath: deviceMediaPath,
      };

      let addError: AddMethodError | undefined;

      switch (mediaDiffAction.data.fs.type) {
        case FILE: {
          const args: AddFilePayload = {
            ...commonArgs,
            type: FILE,
            opts: {
              overwrite: false,
            },
          };

          logger.info(
            `===== Adding Media File =====`,
            `Database Media filepath: ${dbMediaPath}`,
            `Device Media filepath: ${deviceMediaPath}`,
          );

          if (!environment.options.simulate.sync)
            addError = await fileIO.add(args);
          break;
        }
        case DIR: {
          const args: AddDirPayload = {
            ...commonArgs,
            type: DIR,
            opts: {
              overwrite: false,
              recursive: true,
            },
          };

          logger.info(
            `==== Adding Media Directory =====`,
            `Database Media dirpath: ${dbMediaPath}`,
            `Device Media dirpath: ${deviceMediaPath}`,
          );

          if (!environment.options.simulate.sync)
            addError = await fileIO.add(args);
          break;
        }
      }

      if (addError) return addError;
      break;
    }
    case DELETE_MEDIA: {
      let deleteError: DeleteMethodError | undefined;

      switch (mediaDiffAction.data.fs.type) {
        case FILE: {
          const args: DeleteFilePayload = {
            type: FILE,
            path: deviceMediaPath,
            opts: { mustExist: false },
          };

          logger.info(
            `===== Deleting Media File =====`,
            `Device Media filepath: ${deviceMediaPath}`,
          );

          if (!environment.options.simulate.sync)
            deleteError = await fileIO.delete(args);
          break;
        }
        case DIR: {
          const args: DeleteDirPayload = {
            type: DIR,
            path: deviceMediaPath,
            opts: { mustExist: false, recursive: true },
          };

          logger.info(
            `===== Deleting Media Directory =====`,
            `Device Media dirpath: ${deviceMediaPath}`,
          );

          if (!environment.options.simulate.sync)
            deleteError = await fileIO.delete(args);
          break;
        }
      }

      if (deleteError) return deleteError;
      break;
    }
  }
};

export default syncMediaDiffAction;
