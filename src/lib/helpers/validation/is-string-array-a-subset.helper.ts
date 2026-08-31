const isStringArrayASubset = (mainArray: string[], subsetArray: string[]) => {
  const mainSet = new Set(mainArray);
  return subsetArray.every((si) => mainSet.has(si));
};

export default isStringArrayASubset;
