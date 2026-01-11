import type { VersionSystem } from "../../interfaces/version-system.interface.js";

const revUppercasedLetterVersioning: VersionSystem = {
  pattern: /^REV\-[a-zA-Z]$/,
  compareFn: (label1, label2) => {
    const num1 = label1.replace(/REV\-/, "").charCodeAt(0);
    const num2 = label2.replace(/REV\-/, "").charCodeAt(0);
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default revUppercasedLetterVersioning;
