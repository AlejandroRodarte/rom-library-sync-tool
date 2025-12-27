import type { VersionSystem } from "../../types.js";

const dshVersioning: VersionSystem = {
  pattern: /^DS-H[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/DS-H/, "");
    const num2 = +label2.replace(/DS-H/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default dshVersioning;
