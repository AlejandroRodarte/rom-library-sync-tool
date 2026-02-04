import path from "path";
import type { RomDiffAction } from "../../../../types/rom-diff-action.type.js";
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
import { DIR, FILE } from "../../../../constants/fs-types.constants.js";
import {
  ADD_ROM,
  DELETE_ROM,
} from "../../../../constants/rom-diff-action-types.constants.js";
import { READ } from "../../../../constants/rights.constants.js";

const fsExtras = {
  exists,
};

export type SyncRomDiffActionError =
  | ExistsError
  | ExistsFalseResult["error"]
  | AddMethodError
  | DeleteMethodError;

const syncRomDiffAction = async (
  romDiffAction: RomDiffAction,
  paths: { db: string; device: string },
  fileIO: FileIO,
): Promise<SyncRomDiffActionError | undefined> => {
  const deviceRomPath = path.join(paths.device, romDiffAction.data.filename);

  switch (romDiffAction.type) {
    case ADD_ROM: {
      const dbRomPath = path.join(paths.db, romDiffAction.data.filename);

      const [existsResult, existsError] = await fsExtras.exists(
        romDiffAction.data.fs.type,
        dbRomPath,
        READ,
      );

      if (existsError) return existsError;
      if (!existsResult.exists) return existsResult.error;

      const commonArgs: Omit<AddFileTypePayload, "type" | "opts"> = {
        srcPath: dbRomPath,
        dstPath: deviceRomPath,
      };

      let addError: AddMethodError | undefined;

      switch (romDiffAction.data.fs.type) {
        case FILE: {
          const args: AddFilePayload = {
            ...commonArgs,
            type: FILE,
            opts: {
              overwrite: false,
            },
          };

          logger.info(
            `===== Adding ROM File =====`,
            `Database ROM filepath: ${dbRomPath}`,
            `Device ROM filepath: ${deviceRomPath}`,
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
            `==== Adding ROM Directory =====`,
            `Database ROM dirpath: ${dbRomPath}`,
            `Device ROM dirpath: ${deviceRomPath}`,
          );

          if (!environment.options.simulate.sync)
            addError = await fileIO.add(args);
          break;
        }
      }

      if (addError) return addError;
      break;
    }
    case DELETE_ROM: {
      let deleteError: DeleteMethodError | undefined;

      switch (romDiffAction.data.fs.type) {
        case FILE: {
          const args: DeleteFilePayload = {
            type: FILE,
            path: deviceRomPath,
            opts: { mustExist: false },
          };

          logger.info(
            `===== Deleting ROM File =====`,
            `Device ROM filepath: ${deviceRomPath}`,
          );

          if (!environment.options.simulate.sync)
            deleteError = await fileIO.delete(args);
          break;
        }
        case DIR: {
          const args: DeleteDirPayload = {
            type: DIR,
            path: deviceRomPath,
            opts: { mustExist: false, recursive: true },
          };

          logger.info(
            `===== Deleting ROM Directory =====`,
            `Device ROM dirpath: ${deviceRomPath}`,
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

export default syncRomDiffAction;
