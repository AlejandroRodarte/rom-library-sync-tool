import exists, {
  type ExistsError,
  type ExistsResult,
} from "./exists.helper.js";

export type SymlinkExistsResult = ExistsResult;
export type SymlinkExistsError = ExistsError;

const symlinkExists = async (
  symlinkPath: string,
  rights?: "r" | "w" | "rw",
): Promise<
  [SymlinkExistsResult, undefined] | [undefined, SymlinkExistsError]
> => {
  const [symlinkExists, existsError] = await exists(
    "link",
    symlinkPath,
    rights,
  );

  if (existsError) return [undefined, existsError];
  return [symlinkExists, undefined];
};

export default symlinkExists;
