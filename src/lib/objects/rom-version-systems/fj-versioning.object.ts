import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";

const fjVersioning: RomVersionSystem = {
  pattern: /^[A-Z]F[A-Z]J$/,
  compareFn: (label1, label2) => {
    const nums1 = [label1.charCodeAt(0), label1.charCodeAt(2)];
    const nums2 = [label2.charCodeAt(0), label1.charCodeAt(2)];

    for (let i = 0; i < nums1.length; i++) {
      const num1 = nums1[i];
      const num2 = nums2[i];
      if (typeof num1 !== "undefined" && typeof num2 !== "undefined") {
        if (num1 > num2) return 1;
        else if (num1 < num2) return -1;
      }
    }
    return 0;
  },
};

export default fjVersioning;
