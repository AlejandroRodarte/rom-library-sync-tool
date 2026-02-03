import ALL_OR_NONE from "./all-or-none.constant.js";
import REST from "./rest.contant.js";

const ALL_NONE_OR_REST = [...ALL_OR_NONE, REST] as const;

export default ALL_NONE_OR_REST;
