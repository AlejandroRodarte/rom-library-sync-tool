import type { VersionSystem } from "../../types.js";

const betaVersioning: VersionSystem = {
  pattern: /^Beta [0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/Beta /, "");
    const num2 = +label2.replace(/Beta /, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default betaVersioning;
