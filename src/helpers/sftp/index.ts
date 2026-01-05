import addFile from "./add-file.helper.js";
import connect from "./connect.helper.js";
import deleteFile from "./delete-file.helper.js";
import disconnect from "./disconnect.helper.js";
import exists from "./exists.helper.js";

const sftp = { connect, disconnect, exists, addFile, deleteFile };

export default sftp;
