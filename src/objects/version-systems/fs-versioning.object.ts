import type { VersionSystem } from "../../types.js";

const fsVersioning: VersionSystem = {
  pattern: /^FS[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/FS/, "");
    const num2 = +label2.replace(/FS/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default fsVersioning;
