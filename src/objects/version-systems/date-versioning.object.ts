import type { VersionSystem } from "../../types.js";

const dateVersioning: VersionSystem = {
  pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
  compareFn: (label1, label2) => {
    const nums1 = label1.split("-");
    const nums2 = label2.split("-");

    for (const [index, num1] of nums1.entries()) {
      const num2 = nums2[index] || -1;
      if (num1 > num2) return 1;
      else if (num1 < num2) return -1;
    }
    return 0;
  },
};

export default dateVersioning;
