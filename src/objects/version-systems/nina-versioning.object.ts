import type { VersionSystem } from "../../types.js";

const ninaVersioning: VersionSystem = {
  pattern: /^NINA\-[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/NINA\-/, "");
    const num2 = +label2.replace(/NINA\-/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default ninaVersioning;
