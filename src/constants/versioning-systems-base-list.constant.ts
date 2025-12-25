import fourBVersioning from "../objects/version-systems/4b-versioning.object.js";
import a8fVersioning from "../objects/version-systems/a8f-versioning.object.js";
import dateVersioning from "../objects/version-systems/date-versioning.object.js";
import dshVersioning from "../objects/version-systems/ds-h-versioning.object.js";
import fightersVersioning from "../objects/version-systems/fighters-versioning.object.js";
import fsVersioning from "../objects/version-systems/fs-versioning.object.js";
import hhVersioning from "../objects/version-systems/hh-versioning.object.js";
import kgVersioning from "../objects/version-systems/kg-versioning.object.js";
import singleLetterVersioning from "../objects/version-systems/single-letter-versioning.object.js";
import nromVersioning from "../objects/version-systems/nrom-versioning.object.js";
import numbersVersioning from "../objects/version-systems/numbers-versioning.object.js";
import peopleVersioning from "../objects/version-systems/people-versioning.object.js";
import rNumberVersioning from "../objects/version-systems/r-number-versioning.object.js";
import revLetterVersioning from "../objects/version-systems/rev-letter-versioning.object.js";
import revNumberVersioning from "../objects/version-systems/rev-number-versioning.object.js";
import revUppercasedLetterVersioning from "../objects/version-systems/rev-uppercased-letter-versioning.object.js";
import tjVersioning from "../objects/version-systems/tj-versioning.object.js";
import vVersioning from "../objects/version-systems/v-versioning.object.js";
import type { VersionSystem } from "../types.js";
import fjVersioning from "../objects/version-systems/fj-versioning.object.js";

const VERSIONING_SYSTEMS_BASE_LIST: VersionSystem[] = [
  vVersioning,
  revNumberVersioning,
  revUppercasedLetterVersioning,
  revLetterVersioning,
  rNumberVersioning,
  fightersVersioning,
  peopleVersioning,
  dateVersioning,
  fourBVersioning,
  kgVersioning,
  hhVersioning,
  fsVersioning,
  dshVersioning,
  nromVersioning,
  tjVersioning,
  a8fVersioning,
  fjVersioning,
  singleLetterVersioning,
  numbersVersioning,
];

export default VERSIONING_SYSTEMS_BASE_LIST;
