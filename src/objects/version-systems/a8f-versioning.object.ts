import type { VersionSystem } from "../../types.js";

const a8fVersioning: VersionSystem = {
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
