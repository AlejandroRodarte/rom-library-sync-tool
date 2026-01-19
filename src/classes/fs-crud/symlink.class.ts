import symlink from "../../helpers/wrappers/modules/fs/symlink.helper.js";
import unlink from "../../helpers/wrappers/modules/fs/unlink.helper.js";
import type {
  AddMethodError,
  DeleteMethodError,
  FsCrud,
} from "../../interfaces/fs-crud.interface.js";

class Symlink implements FsCrud {
  add: (
    type: "file" | "dir",
    srcPath: string,
    dstPath: string,
  ) => Promise<AddMethodError | undefined> = async (type, srcPath, dstPath) => {
    const symlinkError = await symlink(srcPath, dstPath, type);
    return symlinkError;
  };

  delete: (
    type: "file" | "dir",
    path: string,
  ) => Promise<DeleteMethodError | undefined> = async (type, path) => {
    const unlinkError = await unlink(path);
    return unlinkError;
  };
}

export default Symlink;
