## Priority

- [ ] Implement `list` mode for all devices.
- [ ] Test `list` mode on both `Local` and `SteamDeck` devices.
- [ ] Implement `diff` mode for all devices.
- [ ] Test `diff` mode on both `Local` and `SteamDeck` devices.
- [ ] Consider renaming `syncLocal()` and `syncSteamDeck()` to `syncLocalRoms()` and `syncSteamDeckRoms()`.
- [ ] Create two new functions: `syncLocalMedia()` and `syncSteamDeckMedia()` that will sync ES-DE downloaded media on our devices.
- [ ] Respawn `syncLocal()`, which now should run `syncLocalRoms()`.
- [ ] Respawn `syncSteamDeck()`, which now should run `syncSteamDeckRoms()`, `syncSteamDeckMedia()`, and `syncSteamDeckMetadata()`.
- [ ] Integrate `SIMULATE_SYNC` whenever it's needed.
- [ ] Implement `sync` mode for all devices.
- [ ] Simulate `sync` mode on both `Local` and `SteamDeck` devices. Make sure to run the `list` mode before simulating.
- [ ] Test real `sync` mode on both `Local` and `SteamDeck` devices.
- [ ] Implement `diff-sync` mode for all devices.
- [ ] Test `diff-sync` mode on both `Local` and `SteamDeck` devices.

---

## Backlog

- [ ] Parse the database's `<console>/gamelist.xml` files so we end up with a `Map<string, string>`. Keys are ROM filenames. Values are ES-DE title names.
- [ ] (Steam Deck Only) Use the `<console>/gamelist.xml` parser's map to build our `Titles` object with keys being ES-DE title names (if it exists), or defaulting to the title extracted from the ROM filename (the current and only strategy).
- [ ] Move duplicate code in versioning systems to functions.
- [ ] Migrate ROM labels and languages from arrays to sets.
- [ ] Check if Steam Deck has the last ROM from each diff file.
