import put from "./put.helper.js";
import connect from "./connect.helper.js";
import disconnect from "./disconnect.helper.js";
import exists from "./exists.helper.js";
import sftpDelete from "./delete.helper.js";
import addFile from "./add-file.helper.js";
import deleteFile from "./delete-file.helper.js";

const sftp = {
  connect,
  disconnect,
  exists,
  put,
  delete: sftpDelete,
  addFile,
  deleteFile,
};

export default sftp;
