import path from "path";
import exists, {
  type ExistsError,
  type ExistsFalseResult,
} from "../../../extras/fs/exists.helper.js";
import type {
  AddDirPayload,
  AddFilePayload,
  AddFileTypePayload,
  AddMethodError,
  DeleteDirPayload,
  DeleteFilePayload,
  DeleteMethodError,
  FileIO,
} from "../../../../interfaces/file-io.interface.js";
import environment from "../../../../objects/environment.object.js";
import logger from "../../../../objects/logger.object.js";
import type { MediaDiffAction } from "../../../../types/media-diff-action.type.js";

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
    case "add-media": {
      const dbMediaPath = path.join(paths.db, mediaDiffAction.data.filename);

      const [existsResult, existsError] = await fsExtras.exists(
        mediaDiffAction.data.fs.type,
        dbMediaPath,
        "r",
      );

      if (existsError) return existsError;
      if (!existsResult.exists) return existsResult.error;

      const commonArgs: Omit<AddFileTypePayload, "type" | "opts"> = {
        srcPath: dbMediaPath,
        dstPath: deviceMediaPath,
      };

      let addError: AddMethodError | undefined;

      switch (mediaDiffAction.data.fs.type) {
        case "file": {
          const args: AddFilePayload = {
            ...commonArgs,
            type: "file",
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
        case "dir": {
          const args: AddDirPayload = {
            ...commonArgs,
            type: "dir",
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
    case "delete-media": {
      let deleteError: DeleteMethodError | undefined;

      switch (mediaDiffAction.data.fs.type) {
        case "file": {
          const args: DeleteFilePayload = {
            type: "file",
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
        case "dir": {
          const args: DeleteDirPayload = {
            type: "dir",
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
