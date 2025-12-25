import type { VersionSystem } from "../../types.js";

const dateVersioning: VersionSystem = {
  pattern: /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,
  compareFn: (label1, label2) => {
    const nums1 = label1.split("-");
    const nums2 = label2.split("-");

    for (let i = 0; i < nums1.length; i++) {
      const s1 = nums1[i];
      const s2 = nums2[i];
      if (typeof s1 !== "undefined" && typeof s2 !== "undefined") {
        const n1 = +s1;
        const n2 = +s2;
        if (n1 > n2) return 1;
        else if (n1 < n2) return -1;
      }
    }
    return 0;
  },
};

export default dateVersioning;
