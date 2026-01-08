import type { Consoles } from "../../types.js";

const consolesReport = (consoles: Consoles): void => {
  for (const [_, konsole] of consoles) console.log(konsole.report);

  const romsSelectedTotals = new Map<number, number>();

  for (const [_, konsole] of consoles) {
    romsSelectedTotals.set(0, konsole.scrappedTitles.size);
    for (const [romsSelected, titles] of konsole.selectedTitles) {
      const total = romsSelectedTotals.get(romsSelected);
      if (typeof total !== "undefined")
        romsSelectedTotals.set(romsSelected, total + titles.size);
      else romsSelectedTotals.set(romsSelected, titles.size);
    }
  }

  console.log(`***** All-Consoles Report *****`);
  for (const [romsSelected, total] of romsSelectedTotals)
    console.log(`Titles with ${romsSelected} selections: ${total}.`);
};

export default consolesReport;
