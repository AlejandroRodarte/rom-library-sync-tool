import open, { type OpenError } from "../../wrappers/modules/fs/open.helper.js";

export type CreateEmptyFileError = OpenError;

const createEmptyFile = async (
  filePath: string,
): Promise<CreateEmptyFileError | undefined> => {
  const [openFileHandle, openFileError] = await open(filePath, "w");
  if (openFileError) return openFileError;
  await openFileHandle.close();
};

export default createEmptyFile;
