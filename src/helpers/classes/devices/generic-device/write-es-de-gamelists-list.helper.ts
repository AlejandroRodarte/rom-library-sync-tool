import type {
  FileIO,
  GetMethodError,
} from "../../../../interfaces/file-io.interface.js";
import type { WriteEsDeGamelistsListOperation } from "../../../../interfaces/write-es-de-gamelists-list-operation.interface.js";

export type WriteEsDeGamelistsListError = GetMethodError;

const writeEsDeGamelistsList = async (
  op: WriteEsDeGamelistsListOperation,
  get: FileIO["get"],
): Promise<WriteEsDeGamelistsListError | undefined> => {
  const getError = await get(
    "file",
    {
      src: op.paths.device.file,
      dst: op.paths.project.file,
    },
    { overwrite: true },
  );

  if (getError) return getError;
};

export default writeEsDeGamelistsList;
