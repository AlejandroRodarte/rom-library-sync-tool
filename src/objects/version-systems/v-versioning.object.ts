import type { VersionSystem } from "../../interfaces/version-system.interface.js";

const vVersioning: VersionSystem = {
  pattern: /^[vV]\.?[0-9]+(?:\.[a-zA-Z0-9]+)*$/,
  compareFn: (label1, label2) => {
    const nums1: number[] = [];

    // "v1.01" -> ["1", "01"]
    // "v1.00AI" -> ["1", "00AI"]
    const setA1 = label1.substring(1).split(".").filter(Boolean);
    for (const setA1Item of setA1) {
      // ["1", "01"] -> ["1", "0", "1"]
      // ["1", "00AI"] -> ["1", "0", "0", "A", "I"]
      const setB1 = setA1Item.split("");
      for (const setB1Item of setB1) {
        const isCharLetter = /^[a-zA-Z]$/.test(setB1Item);
        if (isCharLetter) nums1.push(setB1Item.charCodeAt(0));
        else nums1.push(+setB1Item);
      }
    }

    const nums2: number[] = [];

    // "v1.01" -> ["1", "01"]
    // "v1.00AI" -> ["1", "00AI"]
    const setA2 = label2.substring(1).split(".").filter(Boolean);
    for (const setA2Item of setA2) {
      // ["1", "01"] -> ["1", "0", "1"]
      // ["1", "00AI"] -> ["1", "0", "0", "A", "I"]
      const setB2 = setA2Item.split("");
      for (const setB2Item of setB2) {
        const isCharLetter = /^[a-zA-Z]$/.test(setB2Item);
        if (isCharLetter) nums2.push(setB2Item.charCodeAt(0));
        else nums2.push(+setB2Item);
      }
    }

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

export default vVersioning;
