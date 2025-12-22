import type { VersionSystem } from "../../types.js";

const revLetterVersioning: VersionSystem = {
  pattern: /^Rev [a-zA-Z](\.[0-9]+)*$/,
  compareFn: (label1, label2) => {
    const nums1 = label1
      .replace(/Rev /, "")
      .split(".")
      .map((s) => {
        const isCharLetter = /^[a-zA-Z]$/.test(s);
        if (isCharLetter) return s.charCodeAt(0);
        else return +s;
      });
    const nums2 = label2
      .replace(/Rev /, "")
      .split(".")
      .map((s) => {
        const isCharLetter = /^[a-zA-Z]$/.test(s);
        if (isCharLetter) return s.charCodeAt(0);
        else return +s;
      });

    const shortestNumsList = nums1.length < nums2.length ? nums1 : nums2;
    const lengthDiff = Math.abs(nums1.length - nums2.length);
    [...Array(lengthDiff)]
      .fill(undefined)
      .forEach((_) => shortestNumsList.push(0));

    for (const [index, num1] of nums1.entries()) {
      const num2 = nums2[index] || -1;
      if (num1 > num2) return 1;
      else if (num1 < num2) return -1;
    }
    return 0;
  },
};

export default revLetterVersioning;
