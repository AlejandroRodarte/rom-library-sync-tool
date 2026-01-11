import type { VersionSystem } from "../../interfaces/version-system.interface.js";

const mbcVersioning: VersionSystem = {
  pattern: /^MBC[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/MBC/, "");
    const num2 = +label2.replace(/MBC/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default mbcVersioning;
