import copyFile from "../../helpers/wrappers/modules/fs/copy-file.helper.js";
import type {
  AddMethodError,
  DeleteMethodError,
  FsCrud,
} from "../../interfaces/fs-crud.interface.js";

class Copy implements FsCrud {
  add: (
    type: "file" | "dir",
    srcPath: string,
    dstPath: string,
  ) => Promise<AddMethodError | undefined> = async (type, srcPath, dstPath) => {
    switch (type) {
      case "file": {
        const addError = await copyFile(srcPath, dstPath);
      }
    }
    return undefined;
  };

  delete: (
    type: "file" | "dir",
    path: string,
  ) => Promise<DeleteMethodError | undefined> = async (type, path) => {
    return undefined;
  };
}

export default Copy;
