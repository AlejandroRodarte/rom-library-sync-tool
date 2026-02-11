import type { Titles } from "../../../../../../types/roms/titles.type.js";

const banTitlesByName = (titles: Titles, titleNames: string[]): void => {
  for (const titleName of titleNames) {
    const title = titles.get(titleName);
    if (!title) continue;
    title.ban();
  }
};

export default banTitlesByName;
