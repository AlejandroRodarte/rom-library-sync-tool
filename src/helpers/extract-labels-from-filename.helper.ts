const extractLabelsFromFilename = (filename: string): string[] => {
  const labels: string[] = [];
  const labelsRegexp = /\((.*?)\)/g;

  const matches = filename.matchAll(labelsRegexp);

  for (const match of matches) {
    const [, parenthesesText] = match;
    if (parenthesesText) {
      const parenthesesItems = parenthesesText.split(",");
      for (const parenthesesItem of parenthesesItems) {
        const parenthesesLabels = parenthesesItem.split("+");
        parenthesesLabels.forEach((label) => labels.push(label.trim()));
      }
    }
  }

  return labels;
};

export default extractLabelsFromFilename;
