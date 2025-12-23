const extractLabelsFromFilename = (filename: string): string[] => {
  const labels: string[] = [];
  const labelsRegexp = /\((.*?)\)/g;

  const matches = filename.matchAll(labelsRegexp);

  for (const match of matches) {
    const [, parenthesesContent] = match;
    if (parenthesesContent) {
      const parenthesesLabels = parenthesesContent.split(",");
      parenthesesLabels.forEach((label) => labels.push(label.trim()));
    }
  }

  return labels;
};

export default extractLabelsFromFilename;
