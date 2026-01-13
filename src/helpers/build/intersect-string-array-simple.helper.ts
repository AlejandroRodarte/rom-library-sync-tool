const intersectStringArraySimple = <T extends string>(
  arr1: T[],
  arr2: T[],
): T[] => {
  const intersect = arr1.filter((item) => arr2.includes(item));
  return intersect;
};

export default intersectStringArraySimple;
