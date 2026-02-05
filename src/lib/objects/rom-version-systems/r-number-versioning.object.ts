import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";

const rNumberVersioning: RomVersionSystem = {
  pattern: /^R[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/R/, "");
    const num2 = +label2.replace(/R/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default rNumberVersioning;
