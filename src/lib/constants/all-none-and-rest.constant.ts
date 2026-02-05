import ALL_AND_NONE from "./all-and-none.constant.js";
import { REST } from "./all-none-rest.constants.js";

const ALL_NONE_AND_REST = [...ALL_AND_NONE, REST] as const;

export default ALL_NONE_AND_REST;
