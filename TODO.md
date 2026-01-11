## Priority

- [ ] Copy over the `Logger` object I built for better logging support.
- [ ] Add a new `LOG_LEVEL` environment variable to control log levels.
- [ ] Integrate `SIMULATE_SYNC` environment variable into `devices.syncLocal()` and `devices.syncSteamDeck()`. They should log instead of actually adding/removing content.
- [ ] Encapsulate duplicate code between `devices.syncLocal()` and `devices.syncSteamDeck()` inside functions.
- [ ] Explore (and implement) the idea of letting `Device` be an interface, or an abstract class (think this through).
- [ ] Create two new classes that extend/implement `Device`: `Local` and `SteamDeck`.
- [ ] Test real sync on both `Local` and `SteamDeck` devices.
- [ ] Consider renaming `syncLocal()` and `syncSteamDeck()` to `syncLocalRoms()` and `syncSteamDeckRoms()`.
- [ ] Create a new `syncSteamDeckRomMetadata()` function that transfer the database's `<console>/gamelist.xml` to the Steam Deck for ROM metadata sync.
- [ ] Parse the database's `<console>/gamelist.xml` files so we end up with a `Map<string, string>`. Keys are ROM filenames. Values are ES-DE title names.
- [ ] (Steam Deck Only) Use the `<console>/gamelist.xml` parser's map to build our `Titles` object with keys being ES-DE title names (if it exists), or defaulting to the title extracted from the ROM filename (the current and only strategy).
- [ ] Let the `devices/<device>/failed/` subfolder host two new subfolders: `failed/diffs`, and `failed/images`.
    - `failed/diffs` will host all failed operations that occurred while `syncLocalRoms()` and `syncSteamDeckRoms()` ran.
    - `failed/images` will host all failed operations that occurred while `syncLocalMedia()` and `syncSteamDeckMedia()` ran.
- [ ] Create two new functions: `syncLocalMedia()` and `syncSteamDeckMedia()` that will sync ES-DE downloaded media on our devices.
    - They will use the same diff files on `devices/<device>/diff/` to sync media.
    - For the `Local` device, only `add-file` operations will be processed (`remove-file` operations will be ignored because this device uses the database's media directly).
    - `Local/add-file` will check if media has been downloaded for the new ROM file. If it hasn't, it will log this into a file inside `devices/local/failed/images`.
    - For the `SteamDeck` device, both `add-file` and `remove-file` operations will be processed.
    - `SteamDeck/add-file` will try to add the ROM file's downloaded media into its storage. If it fails, it will log it into a file inside `devices/steam-deck/failed/images`.
    - `SteamDeck/remove-file` will try to delete the ROM file's downloaded media from its storage. If it fails, it will log it into a file inside `devices/steam-deck/failed/images`.
- [ ] Respawn `syncLocal()`, which now should run both `syncLocalRoms()` and `syncLocalMedia()`.
- [ ] Respawn `syncSteamDeck()`, which now should run `syncSteamDeckRoms()`, `syncSteamDeckRomMetadata()`, and `syncSteamDeckMedia()`.
- [ ] Make sure to integrate `SIMULATE_SYNC` into all `sync`-related functions.
- [ ] Simulate and test that all sync functions are working.

---

## Backlog

- [ ] Move duplicate code in versioning systems to functions.
- [ ] Migrate ROM labels and languages from arrays to sets.
- [ ] Check if Steam Deck has the last ROM from each diff file.
