const extractLabelsFromFilename = (filename: string): string[] => {
  const labels: string[] = [];
  const labelsRegexp = /\((.*?)\)/g;

  const matches = filename.matchAll(labelsRegexp);

  for (const match of matches) {
    const [, label] = match;
    if (label) labels.push(label);
  }

  return labels;
};

export default extractLabelsFromFilename;
