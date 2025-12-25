import type { VersionSystem } from "../../types.js";

const revNumberVersioning: VersionSystem = {
  pattern: /^Rev [0-9]+(\.[0-9]+)*$/,
  compareFn: (label1, label2) => {
    const nums1 = label1
      .replace(/Rev /, "")
      .split(".")
      .map((s) => +s);
    const nums2 = label2
      .replace(/Rev /, "")
      .split(".")
      .map((s) => +s);

    const shortestNumsList = nums1.length < nums2.length ? nums1 : nums2;
    const lengthDiff = Math.abs(nums1.length - nums2.length);
    [...Array(lengthDiff)]
      .fill(undefined)
      .forEach((_) => shortestNumsList.push(0));

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

export default revNumberVersioning;
