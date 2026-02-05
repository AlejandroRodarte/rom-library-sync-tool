import type { RomVersionSystem } from "../../../../interfaces/roms/rom-version-system.interface.js";
import betaVersioning from "../../../rom-version-systems/beta-versioning.object.js";
import demoVersioning from "../../../rom-version-systems/demo-versioning-object.js";
import protoVersioning from "../../../rom-version-systems/proto-versioning.object.js";
import sampleVersioning from "../../../rom-version-systems/sample-versioning.object.js";

const ROM_VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST: RomVersionSystem[] =
  [betaVersioning, protoVersioning, demoVersioning, sampleVersioning];

export default ROM_VERSIONING_SYSTEMS_FOR_UNRELEASED_ROMS_BASE_PRIORITY_LIST;
