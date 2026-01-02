import type { Consoles } from "../../types.js";

const consolesReport = (consoles: Consoles): void => {
  const romsSelectedTotals = new Map<number, number>();

  for (const [name, konsole] of consoles) {
    console.log(`===== Report for console ${name} =====`);
    for (const [romsSelected, titles] of konsole) {
      console.log(`ROMs with ${romsSelected} selections: ${titles.size}`);
      const total = romsSelectedTotals.get(romsSelected);
      if (typeof total !== "undefined")
        romsSelectedTotals.set(romsSelected, total + titles.size);
      else romsSelectedTotals.set(romsSelected, titles.size);
    }
  }

  console.log(`===== Global Report =====`);
  for (const [romsSelected, total] of romsSelectedTotals)
    console.log(`ROMs with ${romsSelected} selections: ${total}`);
};

export default consolesReport;
