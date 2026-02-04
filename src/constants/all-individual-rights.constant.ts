import { EXECUTE, READ, WRITE } from "./rights.constants.js";

const ALL_INDIVIDUAL_RIGHTS = [READ, WRITE, EXECUTE] as const;

export default ALL_INDIVIDUAL_RIGHTS;
