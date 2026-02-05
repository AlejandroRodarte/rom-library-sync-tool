import type { GamelistChildXmlNode } from "../../../../../interfaces/classes/devices/generic-device/xml/gamelist-child-xml-node.interface.js";

export type GamelistChildXmlNodeFields = Exclude<
  keyof GamelistChildXmlNode,
  "path"
>;
