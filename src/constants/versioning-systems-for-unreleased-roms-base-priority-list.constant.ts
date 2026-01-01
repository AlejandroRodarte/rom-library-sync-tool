import betaVersioning from "../objects/version-systems/beta-versioning.object.js";
import demoVersioning from "../objects/version-systems/demo-versioning-object.js";
import protoVersioning from "../objects/version-systems/proto-versioning.object.js";
import sampleVersioning from "../objects/version-systems/sample-versioning.object.js";
import type { VersionSystem } from "../types.js";

const VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST: VersionSystem[] =
  [betaVersioning, protoVersioning, demoVersioning, sampleVersioning];

export default VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST;
