import type { VersionSystem } from "../../types.js";

const nromVersioning: VersionSystem = {
  pattern: /^NROM [0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.split(",")[0]!.replace(/NROM /, "");
    const num2 = +label2.split(",")[0]!.replace(/NROM /, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default nromVersioning;
