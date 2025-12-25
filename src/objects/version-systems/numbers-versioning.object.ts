import type { VersionSystem } from "../../types.js";

const numbersVersioning: VersionSystem = {
  pattern: /^[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1;
    const num2 = +label2;
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default numbersVersioning;
