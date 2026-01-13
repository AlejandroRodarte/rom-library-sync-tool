import type { MediasList } from "../../../types/medias-list.type.js";
import isMediasListItem from "./is-medias-list-item.helper.js";

const isMediasList = (list: string[]): list is MediasList =>
  list.every((m) => isMediasListItem(m));

export default isMediasList;
