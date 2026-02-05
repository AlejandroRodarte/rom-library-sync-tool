import type { IndividualRight } from "../../../types/rights/individual-right.type.js";
import isIndividualRight from "./is-individual-right.helper.js";

const isIndividualRightList = (list: string[]): list is IndividualRight[] =>
  list.every((r) => isIndividualRight(r));

export default isIndividualRightList;
