import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";

const carsVersioning: RomVersionSystem = {
  pattern: /^[0-9]+ +Cars$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/Cars/, "").trim();
    const num2 = +label2.replace(/Cars/, "").trim();
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default carsVersioning;
