import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";

const a8fVersioning: RomVersionSystem = {
  pattern: /^A8F[A-Z]$/,
  compareFn: (label1, label2) => {
    const num1 = label1.replace(/A8F/, "").charCodeAt(0);
    const num2 = label2.replace(/A8F/, "").charCodeAt(0);
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default a8fVersioning;
