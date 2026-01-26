import type { ConsoleData } from "../interfaces/console-data.interface.js";
import type { ConsoleContent } from "./console-content.type.js";

export type ConsoleEnvData = Partial<
  ConsoleContent<Omit<ConsoleData, "skipFlags">>
>;
