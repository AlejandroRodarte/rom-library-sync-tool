import type { CpError } from "../../wrappers/modules/fs/cp.helper.js";
import cp from "../../wrappers/modules/fs/cp.helper.js";
import type { RmError } from "../../wrappers/modules/fs/rm.helper.js";
import rm from "../../wrappers/modules/fs/rm.helper.js";
import type { DirExistsError } from "./dir-exists.helper.js";
import dirExists from "./dir-exists.helper.js";
import type { ExistsFalseErrors } from "./exists.helper.js";

export interface CopyDirOpts {
  overwrite?: boolean;
  recursive?: boolean;
}

export type CopyDirError =
  | CpError
  | DirExistsError
  | RmError
  | ExistsFalseErrors;

const copyDir = async (
  srcDirPath: string,
  dstDirPath: string,
  opts?: CopyDirOpts,
): Promise<CopyDirError | undefined> => {
  const copyDirOpts: Required<CopyDirOpts> = {
    overwrite: false,
    recursive: true,
  };

  if (opts) {
    if (typeof opts.overwrite !== "undefined")
      copyDirOpts.overwrite = opts.overwrite;
    if (typeof opts.recursive !== "undefined")
      copyDirOpts.recursive = opts.recursive;
  }

  const [srcDirExistsResult, srcDirExistsError] = await dirExists(srcDirPath);

  if (srcDirExistsError) return srcDirExistsError;
  if (!srcDirExistsResult.exists) return srcDirExistsResult.error;

  const [dstDirExistsResult, dstDirExistsError] = await dirExists(dstDirPath);

  if (dstDirExistsError) return dstDirExistsError;
  if (dstDirExistsResult.exists && !copyDirOpts.overwrite) return undefined;

  if (dstDirExistsResult.exists && copyDirOpts.overwrite) {
    const rmError = await rm(dstDirPath, { recursive: copyDirOpts.recursive });
    if (rmError) return rmError;
  }

  const cpError = await cp(srcDirPath, dstDirPath, {
    recursive: copyDirOpts.recursive,
    force: copyDirOpts.overwrite,
    errorOnExist: dstDirExistsResult.exists,
  });

  if (cpError) return cpError;
};

export default copyDir;
