import { Context } from "cordis"
import { Card, cardGenerator } from "./card"
import { Deck } from "./regulates/type"

// const enum Level {

// }

export class Player {
  ctx: Context
  basicState: {
    health: number,
    maxHealth: number,
    mana: number,
    level: number,
  };
  hrdayasutra: Card;
  groundState: Record<string,Card[]>;
  constructor(ctx: Context, config: Player.Config) {
    const id = config.id;
    const deck = config.deck;
    this.basicState = {
      health: 10,
      maxHealth: 10,
      mana: id === 0? 1: 2,
      level: id === 0? 1: 2,
    };
    this.groundState = {
      sorceryState: [],
      equipmentState: [],
      zisurruState: [],
      libraryState: deck.cardList.map((val) => cardGenerator(val, ctx)),
      graveyardState: [],
      blackholeState: [],
      handState: [],
    };
    this.hrdayasutra = cardGenerator(deck.hrdayasutra, ctx);
    this.shuffleLibrary();
    this.draw(5);
  }


  shuffleLibrary(lib: string = "libraryState") {
    this.groundState[lib].sort(() => (Math.random()-0.5));
  }

  moveCard(from: string, to: string, id: number, shuffle: boolean = false) {
    for(let i = 0; i < this.groundState[from].length; ++i) {
      if(this.groundState[from][i].UID === id) {
        
        // const card = this.groundState[from].splice(i);
        const card = this.groundState[from].splice(i, 1);
        if(card != undefined) {
          this.groundState[to].push(card[0]);
          if(shuffle) {
            this.shuffleLibrary(to);
          }
        }
        return;
      }
    }
  }

  hurt(val: number = 1) {
    this.basicState.health -= val;
  }

  exhaust() {
    this.hurt();
  }

  draw(times: number = 1, top: boolean = true): Card[] {
    const cards: Card[] = [];
    for(let i = 0; i < times; ++i) {
      if(this.groundState.libraryState.length == 0) {
        this.exhaust();
      }else{
        const card = top?this.groundState.libraryState.pop():this.groundState.libraryState.shift();
        if(card != undefined) {
          cards.push(card);
        }
      }
    }
    if(cards.length > 0) {
      this.groundState.handState.push(...cards);
    }
    return cards;
  }

  reveal(UIDs: number[]) {
    for(const UID of UIDs) {
      for(const i of this.groundState.handState) {
        if(i.UID === UID) {
          i.turnFace(true);
        }
      }
    }
  }

  levelChange(times: number = 1) {
    this.basicState.level += times;
    if(this.basicState.level > 10) {
      this.basicState.level = 10;
    }
  }

  practice(choice: number) {
    choice == 0? this.draw(2): this.levelChange();
  }

  /* true means live while false means dead */
  alive() {
    return this.basicState.health > 0;
  }

  manaRestore() {
    this.basicState.mana = Math.max(this.basicState.mana,this.basicState.level);
  }

  untapAll() {
    for(const i of this.groundState.sorceryState) {
      i.turnTap(false);
    }
    for(const i of this.groundState.zisurruState) {
      i.turnTap(false);
    }
    for(const i of this.groundState.equipmentState) {
      i.turnTap(false);
    }
    this.manaRestore();
  }

  // discard(state: DiscardState) {
  //   state.sort();
  //   for(let i = state.length - 1; i >= 0; --i) {
  //     const card = this.groundState.handState.splice(state[i],1);
  //     card[0].turnFace(true);
  //     this.groundState.graveyardState.push(card[0]);
  //   }
  // }

  search(id: number[], location: string[]): Card[]{
    const ret: Card[] = [];
    for(const i of location) {
      for(const j of this.groundState[i]) {
        for(const k of id) {
          if(j.UID == k) {
            ret.push(j);
          }
        }
      }
    }
    return ret;
  }

  // cast(owner: number, id: number, targets: TargetSets, gameState: GameState) {
  //   const cards = this.search([id], ["handState"]);
  //   const card = cards[0];
  //   if(card != undefined) {
  //     if(card.checkCost(this) && card.checkLevel(this)){
  //       card.spendCost(this);
  //       card.turnFace(true);
  //       card.resolve(owner, gameState, targets);
  //     } else {
  //       // Todo: Deal with those that cannot cast.
  //     }
  //   }else{
      
  //   }
    
  // }
}

export namespace Player {
  export interface Config {
    id: number,
    deck: Deck,
  }
}

Context.service('players', )
