import type { VersionSystem } from "../../types.js";

const kgVersioning: VersionSystem = {
  pattern: /^KG-[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.split(",")[0]!.replace(/KG-/, "");
    const num2 = +label2.split(",")[0]!.replace(/KG-/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default kgVersioning;
