import type { RomVersionSystem } from "../../interfaces/roms/rom-version-system.interface.js";
import betaVersioning from "../../objects/rom-version-systems/beta-versioning.object.js";
import demoVersioning from "../../objects/rom-version-systems/demo-versioning-object.js";
import protoVersioning from "../../objects/rom-version-systems/proto-versioning.object.js";
import sampleVersioning from "../../objects/rom-version-systems/sample-versioning.object.js";

const ROM_VERSION_SYSTEMS_FOR_UNRELEASED_ROMS_PRIORITY_LIST: RomVersionSystem[] =
  [betaVersioning, protoVersioning, demoVersioning, sampleVersioning];

export default ROM_VERSION_SYSTEMS_FOR_UNRELEASED_ROMS_PRIORITY_LIST;
