import { Context } from "cordis"

declare module 'cordis' {
  interface Context{
    cardUID: CardUIDManager
  }
}

class CardUIDManager {
  count = 0;
  get() {
    return ++this.count;
  }
}

Context.service('cardUID', CardUIDManager);

export class Card {
  ctx: Context
  name: string = "default card";
  counter: Record<string,number>;
  tapped: boolean = false;
  faceup: boolean = false;
  attribute: Record<string, number>;
  sectID: number = -1;
  level: number = -1;
  typeID: number = -1;
  rarity: number = -1;
  UID: number = -1;
  
  constructor(ctx: Context, name: string) {
    this.name = name;
    this.counter = {};
    this.attribute = {};
    this.tapped = false;
    this.faceup = false;
    this.UID = ctx.cardUID.get();
  }

  turnFace(face: boolean) {
    this.faceup = face;
  }

  turnTap(tap: boolean) {
    this.tapped = tap;
  }
  
  // resolve(owner: number, gameState: GameState, targets: TargetSets) {
  //   for(const i of this.cast.resolveEvent.events) {
  //     logger.silly("Card event happened by %s target on: %s", owner, targets);
  //     i.resolve(owner, gameState, targets);
  //   }
  //   gameState.playerState[owner].moveCard("handState", this.cast.resolveEndPlace.place, this.UID, this.cast.resolveEndPlace.shuffle);
  // }
}

export function cardGenerator(name: string, ctx: Context): Card {
  switch(name) {
    default: {
      return new Card(ctx, name);
    }
  }
}