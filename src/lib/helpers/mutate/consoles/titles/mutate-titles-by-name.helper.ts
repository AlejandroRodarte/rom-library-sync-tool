import type Title from "../../../../classes/entities/title.class.js";
import type { Titles } from "../../../../types/roms/titles.type.js";

type TitleMutationOps = Map<string, (title: Title) => void>;

const mutateTitlesByName = (titles: Titles, ops: TitleMutationOps) => {
  for (const [titleName, operation] of ops) {
    const title = titles.get(titleName);
    if (!title) continue;
    operation(title);
  }
};

export default mutateTitlesByName;
