import type { MediaName } from "../../../types/media/media-name.type.js";
import isMediaName from "./is-media-name.helper.js";

const isMediaList = (list: string[]): list is MediaName[] =>
  list.every((m) => isMediaName(m));

export default isMediaList;
