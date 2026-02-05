import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";

const rDotCDotVersioning: RomVersionSystem = {
  pattern: /^R\.C\.#[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/R\.C\.#/, "");
    const num2 = +label2.replace(/R\.C\.#/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default rDotCDotVersioning;
