import betaVersioning from "../objects/version-systems/beta-versioning.object.js";
import demoVersioning from "../objects/version-systems/demo-versioning-object.js";
import protoVersioning from "../objects/version-systems/proto-versioning.object.js";
import type { VersionSystem } from "../types.js";

const VERSIONING_SYSTEMS_LIST_FOR_UNRELEASED_ROMS: VersionSystem[] = [
  betaVersioning,
  protoVersioning,
  demoVersioning,
];

export default VERSIONING_SYSTEMS_LIST_FOR_UNRELEASED_ROMS;
