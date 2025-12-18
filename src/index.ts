import { readdir, readFile } from "node:fs/promises";
import path from "path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONSOLE_NAME = "snes";
const localRomDirPath = `/media/alejandro/3tb-ssd/home/alejandro/games/roms/${CONSOLE_NAME}`;
const myrientRomFilePath = path.join(
  __dirname,
  "..",
  "data",
  `rom-list-myrient-${CONSOLE_NAME}.txt`,
);

const main = async () => {
  const myrientFileContent = await readFile(myrientRomFilePath, "utf-8");
  const myrientRomNames = myrientFileContent
    .split("\n")
    .map((name) => name.split(".")[0]);

  const localRomFiles = await readdir(localRomDirPath);
  const localRomNames = localRomFiles.map((name) => name.split(".")[0]);

  for (const myrientRom of myrientRomNames) {
    let found = false;
    for (const localRom of localRomNames) {
      if (localRom === myrientRom) {
        found = true;
        break;
      }
    }
    if (!found) {
      console.log(myrientRom);
    }
  }
};

main();
