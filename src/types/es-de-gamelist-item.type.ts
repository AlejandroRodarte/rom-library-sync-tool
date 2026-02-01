import type { GamelistChildXmlNode } from "../interfaces/gamelist-child-xml-node.interface.js";

export type EsDeGamelistItem = {
  [K in keyof GamelistChildXmlNode]: string;
};
