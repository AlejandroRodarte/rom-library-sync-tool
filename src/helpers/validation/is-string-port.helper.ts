import isStringInteger from "./is-string-integer.helper.js";

const isStringPort = (s: string): boolean => {
  if (!isStringInteger(s)) return false;
  const port = +s;
  return port >= 1 && port <= 65535;
};

export default isStringPort;
