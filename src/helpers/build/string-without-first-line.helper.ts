import os from "node:os";

const stringWithoutFirstLine = (s: string): string => {
  if (s.length === 0) return s;
  const lines = s.split(os.EOL);
  lines.shift();
  const newString = lines.join("\n");
  return newString;
};

export default stringWithoutFirstLine;
