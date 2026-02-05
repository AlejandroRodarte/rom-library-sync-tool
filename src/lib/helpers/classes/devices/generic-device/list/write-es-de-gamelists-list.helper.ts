import { FILE } from "../../../../../constants/fs/fs-types.constants.js";
import type { WriteEsDeGamelistsListOperation } from "../../../../../interfaces/classes/devices/generic-device/operations/write-es-de-gamelists-list-operation.interface.js";
import type {
  FileIO,
  GetMethodError,
} from "../../../../../interfaces/file-io.interface.js";

export type WriteEsDeGamelistsListError = GetMethodError;

const writeEsDeGamelistsList = async (
  op: WriteEsDeGamelistsListOperation,
  get: FileIO["get"],
): Promise<WriteEsDeGamelistsListError | undefined> => {
  const getError = await get(
    FILE,
    {
      src: op.paths.device.file,
      dst: op.paths.project.file,
    },
    { overwrite: true },
  );

  if (getError) return getError;
};

export default writeEsDeGamelistsList;
