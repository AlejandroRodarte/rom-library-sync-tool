import type { GamelistChildXmlNode } from "../interfaces/gamelist-child-xml-node.interface.js";

export type GamelistChildXmlNodeFields = Exclude<
  keyof GamelistChildXmlNode,
  "path"
>;
