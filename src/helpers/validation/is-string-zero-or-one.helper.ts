const isStringZeroOrOne = (s: string): boolean => {
  if (s.length === 0) return false;
  const isZeroOrOne = /^[0-1]{1}$/.test(s);
  return isZeroOrOne;
};

export default isStringZeroOrOne;
