import type { READ, READ_WRITE, WRITE } from "../constants/rights.constants.js";

export type RightsForValidation = typeof READ | typeof WRITE | typeof READ_WRITE;
