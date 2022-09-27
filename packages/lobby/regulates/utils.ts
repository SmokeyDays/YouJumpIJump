export function assert(condition: boolean) {
  if(!condition){
    throw new Error("VITAL_ERROR: Unmatched Assertion");
  }
}

class CardUIDManager {
  count = 0;
  get() {
    return ++this.count;
  }
}

export const CardUID = new CardUIDManager();
