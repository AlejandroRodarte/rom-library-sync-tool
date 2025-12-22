import type { VersionSystem } from "../../types.js";

const fourBVersioning: VersionSystem = {
  pattern: /^4B-[0-9]+((, [\w-]*))?$/,
  compareFn: (label1, label2) => {
    const num1 = +label1.split(",")[0]!.replace(/4B-/, "");
    const num2 = +label2.split(",")[0]!.replace(/4B-/, "");
    if (num1 > num2) return 1;
    else if (num1 < num2) return -1;
    else return 0;
  },
};

export default fourBVersioning;
