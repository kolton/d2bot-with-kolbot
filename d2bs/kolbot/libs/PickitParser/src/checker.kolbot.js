/**
 * Kolbot compatible implementation
 * Use this unless we want to alter the core libs
 */
const checkerKolbot = {
  checkEntry(item, entry) {

  },
  checkItem(item, entries) {
    for (const entry of entries) {
      print(entry)
    }

    return {
      result: PickitEnum.UNWANTED,
    }
  },
}