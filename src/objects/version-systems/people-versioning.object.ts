import type { VersionSystem } from "../../interfaces/version-system.interface.js";

const peopleVersioning: VersionSystem = {
  pattern: /^[0-9]+ +People$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/People/, "").trim();
    const num2 = +label2.replace(/People/, "").trim();
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default peopleVersioning;
