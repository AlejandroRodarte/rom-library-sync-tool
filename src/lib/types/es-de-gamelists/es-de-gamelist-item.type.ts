import type { GamelistChildXmlNode } from "../../interfaces/classes/devices/generic-device/xml/gamelist-child-xml-node.interface.js";

export type EsDeGamelistItem = {
  [K in keyof GamelistChildXmlNode]: string;
};
