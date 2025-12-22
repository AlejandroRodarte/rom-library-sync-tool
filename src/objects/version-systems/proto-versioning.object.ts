import type { VersionSystem } from "../../types.js";

const protoVersioning: VersionSystem = {
  pattern: /^Proto( [0-9]+)?$/,
  compareFn: (label1, label2) => {
    const num1 = label1.replace(/Proto/, "").trim() || 0;
    const num2 = label2.replace(/Proto/, "").trim() || 0;
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default protoVersioning;
