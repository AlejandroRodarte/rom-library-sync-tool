import type { VersionSystem } from "../../interfaces/version-system.interface.js";

const tjVersioning: VersionSystem = {
  pattern: /^TJ[A-Z]J$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/TJ/, "").charAt(0).charCodeAt(0);
    const num2 = +label2.replace(/TJ/, "").charAt(0).charCodeAt(0);
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default tjVersioning;
