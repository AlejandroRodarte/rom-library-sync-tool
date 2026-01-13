import type { MediasListItem } from "../../../types/medias-list-item.type.js";
import isMediaName from "./is-media-name.helper.js";

const isMediasListItem = (m: string): m is MediasListItem =>
  isMediaName(m) || m === "none" || m === "all";

export default isMediasListItem;
