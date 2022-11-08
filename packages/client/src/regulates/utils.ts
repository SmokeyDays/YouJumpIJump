import counterDictionary from "../assets/text/counter.json";
import cardDescription from "../assets/text/cardDescription.json";
import { GameStage, GameState } from "./Interfaces";

export class ImgsManager {
  // Singleton
  
  private static instance: ImgsManager;
  reqImgs;
  paths: IterableIterator<number>;
  private constructor() {
    this.reqImgs = require.context('../assets/cards', true, /\.png$/);
    this.paths = this.reqImgs.keys()
  }
  static getInstance() {
    if(!this.instance) {
      this.instance = new ImgsManager();
    }
    return this.instance;
  }
  
  getImg(path: string) {
    return this.reqImgs("./" + path);
  }
}

export const CounterDictionary: Record<string,string> = counterDictionary;

export const AttributeList: Record<string,string> = {
  "power": "攻击",
  "defense": "防御",
  "durability": "耐久",
}

export function attributeTranslate(val: string): string {
  return val in AttributeList? AttributeList[val]: "";
}

export function counterTranslate(val: string): string {
  return val in CounterDictionary? CounterDictionary[val]: val;
}

export interface CardDesc {
  id: string,
  name: string,
  desc: string,
  lore: string,
}

export const CardDescription: Record<string, CardDesc> = cardDescription;

export function getDescription(id: string): string {
  return CardDescription[id].desc!=""?CardDescription[id].desc:"卡牌无描述";
}

export const SectList: string[] = ["通用","奔雷","焚金","焚天","光华","飘渺","天灵","万法","元力"];
export const TypeList: string[] = ["万物","即时","触发","持续","法阵","攻击","防御","法器"];
export const LevelList: string[] = ["凡人","通天","练气","筑基","金丹","元神","炼虚","涅槃","逍遥"];

export function showSect(val: number): string {
  return SectList[val];
}

export function showType(val: number): string {
  return TypeList[val];
}

export function showLevel(val: number): string {
  return val<=7?LevelList[val]:LevelList[7];
}


export function numberAbbr(val: number): string {
  let ret = "Number Abbr Failed";
  if(val<1000){
    return val.toString();
  }else if(val<10000){
    return (Math.floor(val/1000)).toString() + "k";
  }else if(val<10000000){
    return (Math.floor(val/10000)).toString() + "w";
  }else if(val<1e10){
    return val.toPrecision(1);
  }else{
    return "很大";
  }
  return ret;
}

export function getUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export function isInstant(card: string) {
  const instantCardList: string[] = ["2", "5", "6", "7", "8", "J", "BJ", "RJ"];
  if(instantCardList.indexOf(card) > -1) {
    return true;
  }
  return false;
}

export function noMove(card: string ) {
  const noMoveList: string[] = ["5", "6", "7", "K", "0", "RJ"];
  if(noMoveList.indexOf(card) > -1) {
    return true;
  }
  return false;
}