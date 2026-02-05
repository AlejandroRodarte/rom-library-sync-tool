import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";

const sampleVersioning: RomVersionSystem = {
  pattern: /^Sample +[0-9]+$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.replace(/Sample/, "").trim();
    const num2 = +label2.replace(/Sample/, "").trim();
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default sampleVersioning;
