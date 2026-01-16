import access from "./access.helper.js";
import addFile from "./add-file.helper.js";
import deleteFile from "./delete-file.helper.js";
import dirExists from "./dir-exists.helper.js";
import fileExists from "./file-exists.helper.js";

const sftp = {
  addFile,
  deleteFile,
  fileExists,
  dirExists,
  access,
};

export default sftp;
