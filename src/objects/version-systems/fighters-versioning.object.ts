import type { VersionSystem } from "../../types.js";

const fightersVersioning: VersionSystem = {
  pattern: /^[0-9]+ +Fighters$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/Fighters/, "").trim();
    const num2 = +label2.replace(/Fighters/, "").trim();
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default fightersVersioning;
