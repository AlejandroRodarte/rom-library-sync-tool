import ALL_INDIVIDUAL_RIGHTS from "../../../constants/all-individual-rights.constant.js";
import type { IndividualRight } from "../../../types/individual-right.type.js";

const isIndividualRight = (r: string): r is IndividualRight =>
  ALL_INDIVIDUAL_RIGHTS.includes(r as IndividualRight);

export default isIndividualRight;
