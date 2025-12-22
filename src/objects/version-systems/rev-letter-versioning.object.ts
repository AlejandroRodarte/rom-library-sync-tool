import type { VersionSystem } from "../../types.js";

const revLetterVersioning: VersionSystem = {
  pattern: /^Rev [A-Z]$/,
  compareFn: (label1, label2) => {
    const num1 = label1.replace(/Rev /, "").charCodeAt(0);
    const num2 = label2.replace(/Rev /, "").charCodeAt(0);
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default revLetterVersioning;
