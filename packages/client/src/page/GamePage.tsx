import React from 'react';
import logo from '../assets/lowlogo.png';
import gameBackground from '../assets/game-background.png';
import './GamePage.css';
import internal from 'stream';
import { assert, countReset } from 'console';
import { CardState, GameStage, GameState, GameStep, PlayerState} from '../regulates/Interfaces';
import { numberAbbr, counterTranslate, showSect, showType, showLevel, getDescription, attributeTranslate, getCardStateByID } from '../regulates/utils';
import { FilterBackground, PopupBtn } from './Composition';
import { DEBUG_MODE } from '../regulates/settings';
import { FreeOperation, InstantOperation, PlayerOperation } from '../regulates/signals';
import PlayerFunction from '../action/PlayerFunction';

const attributesWithoutCost = ["power","durability","defense"];
const attributesList = ["power","durability","defense","castCost","maintainCost"];

function getPriorityName(id: number) {
  return id === 1? "Bob": "Alice";
}

class PracticeChoiceWindow extends React.Component {
  practiceChoose(val: number) {
    PlayerFunction.playerSignalIngame({
      type: PlayerOperation.PRACTICE,
      state: val,
    });
  }
  render(): React.ReactNode {
    return(
      <PopupBtn
        btnComponent={
          <div className='practice-choice-btn'>
            修炼
          </div>
        }
        windowComponent={
          <div className='practice-choice-window'>
            <div className='practice-choice-title'>选择修炼方式</div>
            <div className='practice-choice-list'>
              <div className='practice-choice-erudio practice-choice-option' onClick={() => this.practiceChoose(0)}>
                <div className='practice-choice-option-title'>博闻</div>
                <div className='practice-choice-desc'>抽 2 张牌</div>
              </div>
              <div className='practice-choice-askesis practice-choice-option' onClick={() => this.practiceChoose(1)}>
                <div className='practice-choice-option-title'>潜修</div>
                <div className='practice-choice-desc'>加 1 修为</div>
              </div>
            </div>
          </div>
        }
      />
    );
  }
}

interface PassBtnProps {
  type: PlayerOperation,
}

class PassBtn extends React.Component<PassBtnProps,{}> {
  passAction(type: PlayerOperation) {
    switch(type){
      case PlayerOperation.FREE_ACTION: {
        PlayerFunction.playerSignalIngame({
          type: PlayerOperation.FREE_ACTION,
          state: {
            type: FreeOperation.PASS,
            state: null,
          },
        });
        break;
      }
      case PlayerOperation.INSTANT_ACTION: {
        PlayerFunction.playerSignalIngame({
          type: PlayerOperation.INSTANT_ACTION,
          state: {
            type: InstantOperation.PASS,
            state: null,
          },
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  render(): React.ReactNode {
    return (
      <div className='pass-btn' onClick={() => this.passAction(this.props.type)}>
        跳过
      </div>
    );
  }
}

interface CardDetailInfoProps {
  name: string,
  value: string,
}

class CardDetailInfo extends React.Component<CardDetailInfoProps,{}> {
  render() {
    return (
      <div className="card-detail-info">
        <p className="card-detail-info-name">{this.props.name}</p>
        <p className="card-detail-info-value">{this.props.value}</p>
      </div>
    );
  }
}

interface CardDetailProps {
  cardState: CardState
}

class CardDetail extends React.Component<CardDetailProps,{}> {
  detailInfoGenerator() {
    const cardState = this.props.cardState;
    let ret = [];
    for(const i of attributesWithoutCost) {
      if(i in cardState.attribute) {
        ret.push(<CardDetailInfo name={attributeTranslate(i)} value={numberAbbr(cardState.attribute[i])}/>)
      }
    }
    for(const key in cardState.counter) {
      ret.push(<CardDetailInfo name={counterTranslate(key)} value={numberAbbr(cardState.counter[key])}/>);
    }
    if(ret.length > 10) {
      console.log("Error: too much counters.");
    }
    return ret;
  }
  render() {
    const cardState = this.props.cardState;
    // Todo: Replace Type with icon.
    const attributes = [];
    for(const i of attributesList) {
      if(i in cardState.attribute) {
        attributes.push(<p className={"card-detail-" + i}>{attributeTranslate(i) + numberAbbr(cardState.attribute[i])}</p>)
      }
    }
    return (
      <div className="card-detail">
        <p className="card-detail-name">{cardState.name}</p>
        {attributes}
        <p className="card-detail-sect">{showSect(cardState.sectID)}</p>
        <p className="card-detail-type">{showType(cardState.typeID)}</p>
        <p className="card-detail-level">{showLevel(cardState.level)}</p>
        <p className="card-detail-description">{getDescription(cardState.name)}</p>
        <div className="card-detail-info-frame">
          {this.detailInfoGenerator()}
        </div>
      </div>
    );
  }
}

interface CardDisplayProps {
  displayType: string,
  isSpotCard: boolean,
  cardState: CardState,
  onClick: (val: number) => void,
  onHover: (val: CardState | null) => void,
  lookable: boolean,
}

class CardDisplay extends React.Component<CardDisplayProps,{}> {
  render() {
    const cardState = this.props.cardState;
    let ret = (<div className='error-placeholder'></div>);
    let className = '';
    let mouseEnter = () => {};
    let mouseLeave = () => {};
    let inner = [<div className='error-placeholder'></div>];
    switch(this.props.displayType) {
      case "battleground": {
        const attributes = [];
        for(const i of attributesWithoutCost) {
          if(i in cardState.attribute) {
            attributes.push(<p className={"card-ground-" + i}>{numberAbbr(cardState.attribute[i])}</p>)
          }
        }
        if(cardState.faceup) {
          className = 'card-ground '+(cardState.tapped?'card-ground-tapped':'');
          mouseEnter = () => {this.props.onHover(cardState);};
          mouseLeave = () => {this.props.onHover(null);};
          inner = [
            <p className={'card-ground-name'}>{cardState.name}</p>
          ]
          inner.push(...attributes);
        } else {
          className = 'card-ground-facedown '+(cardState.tapped?'card-ground-tapped':'');
          mouseEnter = this.props.lookable?() => {this.props.onHover(cardState)}:()=>{};
          mouseLeave = this.props.lookable?() => {this.props.onHover(null);}:()=>{};
        }
        break;
      }
      case "hand": {
        inner = [
          <div className={'card-hand-name'}>
            {cardState.name}
          </div>
        ]
        if(this.props.lookable) {
          className = 'card-hand';
          mouseEnter = () => {this.props.onHover(cardState);};
          mouseLeave = () => {this.props.onHover(null);}
        }else{
          className = cardState.faceup?'card-hand':'card-hand-facedown';
          mouseEnter = cardState.faceup?() => {this.props.onHover(cardState)}:()=>{};
          mouseLeave = cardState.faceup?() => {this.props.onHover(null);}:()=>{};
        }
        break;
      }
      default: {
        break;
      }
    }
    className += this.props.isSpotCard? ' is-spot-card': '';
    ret = (
      <div className={className} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onClick={() => this.props.onClick(cardState.UID)}>
        {inner}
      </div>
    )
    return ret;
  }
}

interface GameProgressInfoProps {
  state: {
    stage: GameStage,
    step: GameStep,
    /* 0: Alice, 1: Bob */
    priority: number,
    turn: number,
    round: number,
  }
  signal: PlayerOperation,
}

class GameProgressInfo extends React.Component<GameProgressInfoProps, {}> {
  render(): React.ReactNode {
    const automatonState = this.props.state;
    return (
      <div className='process-detail'>
        <div className='process-game'>
          {"Round: " + automatonState.round + ", Stage: " + automatonState.stage + ", Step: " + automatonState.step}
        </div>
        <div className='process-priority'>
          {"Turn Owner: " + (getPriorityName(automatonState.turn)) + ", Priority Owner: " + (getPriorityName(automatonState.priority))}
        </div>
        {DEBUG_MODE? <div className='waiting-signal'>
          {"Waiting Signal: " + this.props.signal}
        </div> : <div/>}
      </div>
    );
  }
}
interface GamePageProps {
  gameState: GameState,
  signal: PlayerOperation,
}

interface GamePageState {
  showingCard: CardState | null,
  spotCardID: number,
}

class GamePage extends React.Component<GamePageProps,GamePageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      showingCard: null,
      spotCardID: -1,
    };
    this.setDetailDisplay = this.setDetailDisplay.bind(this);
    this.setSpotCardID = this.setSpotCardID.bind(this);
  }

  castSpotCard() {
    if(this.state.spotCardID !== -1) {
      PlayerFunction.playerSignalIngame({
        type: PlayerOperation.FREE_ACTION,
        state: {
          type: FreeOperation.CAST,
          state: [this.state.spotCardID, []],
        }
      })
    }
  }

  setDetailDisplay(val: CardState | null) {
    this.setState({showingCard: val});
  }

  setSpotCardID(val: number) {
    this.setState({spotCardID: (this.state.spotCardID === val? -1: val)});
  }

  groundCardGenerator(arr: CardState[],limit: number,lookable: boolean) {
    console.assert(arr.length <= limit);
    return arr.map(state => <CardDisplay isSpotCard={state.UID === this.state.spotCardID} displayType="battleground" cardState={state} onClick={this.setSpotCardID} onHover={this.setDetailDisplay} lookable={lookable}/>);
  }

  handCardGenerator(arr: CardState[],inMyHand: boolean) {
    return arr.map(state => <CardDisplay isSpotCard={state.UID === this.state.spotCardID} displayType="hand" cardState={state} onClick={this.setSpotCardID} onHover={this.setDetailDisplay} lookable={inMyHand}/>);
  }

  render() {
    const playerState = this.props.gameState.playerState;
    const myBasicState = playerState[0].basicState;
    const rivalBasicState = playerState[1].basicState;
    const myGroundState = playerState[0].groundState;
    const rivalGroundState = playerState[1].groundState;
    const automatonState = this.props.gameState.automatonState;
    const signal = this.props.signal;

    switch(signal) {
      case PlayerOperation.INSTANT_ACTION: {
        PlayerFunction.playerSignalIngame({
          type: PlayerOperation.INSTANT_ACTION,
          state: {
            type: InstantOperation.PASS,
            state: null,
          }
        })
        break;
      }
      case PlayerOperation.ATTACK: {
        PlayerFunction.playerSignalIngame({
          type: PlayerOperation.ATTACK,
          state: {},
        })
        break;
      }
      case PlayerOperation.DISCARD: {
        PlayerFunction.playerSignalIngame({
          type: PlayerOperation.DISCARD,
          state: [],
        })
        break;
      }
    }

    const spotCard = getCardStateByID(this.props.gameState, this.state.spotCardID);

    const castBtn = (
      <div className='cast-btn' onClick={() => this.castSpotCard()}>
        施放
      </div>
    );
    return (
      <div className="game-scene">
        <div className='progress-displayer'>
          <PopupBtn btnComponent={
            <div className='progress-info-btn'>i</div>
          } windowComponent = {
            <GameProgressInfo state = {automatonState} signal = {signal}/>
          }/>
          {signal === PlayerOperation.PRACTICE? <PracticeChoiceWindow/>: <div/>}
          {(signal === PlayerOperation.FREE_ACTION || signal === PlayerOperation.INSTANT_ACTION)? <PassBtn type = {signal}/>: <div/>}
          {signal === PlayerOperation.FREE_ACTION? castBtn: null}
        </div>
        <div className="my-displayer">
          <div className="my-sorcery">
            {this.groundCardGenerator(myGroundState.sorceryState, 8, true)}
          </div>
          <div className="my-zisurru">
            {this.groundCardGenerator(myGroundState.zisurruState, 3, true)}
          </div>
          <div className="my-equipment">
            {this.groundCardGenerator(myGroundState.equipmentState, 3, true)} {/* Is Record visitiable by this? */}
          </div>
          <div className="my-library">
            {myGroundState.libraryState.length}
          </div>
          <div className="my-graveyard">
            {myGroundState.graveyardState.length}
          </div>
          <div className="my-blackhole">
            {myGroundState.blackholeState.length}
          </div>
          <div className="my-hand">
            {this.handCardGenerator(myGroundState.handState, true)}
          </div>
          <div className="my-info">
            <p>{"命火: " + myBasicState.health}</p>
            <p>{"灵力: " + myBasicState.mana}</p>
            <p>{"修为: " + showLevel(myBasicState.level)}</p>
          </div>
        </div>
        <div className="rival-displayer">
          <div className="rival-sorcery">
            {this.groundCardGenerator(rivalGroundState.sorceryState, 8, false)}
          </div>
          <div className="rival-zisurru">
            {this.groundCardGenerator(rivalGroundState.zisurruState, 3, false)}
          </div>
          <div className="rival-equipment">
            {this.groundCardGenerator(rivalGroundState.equipmentState, 3, false)}
          </div>
          <div className="rival-library">
            {rivalGroundState.libraryState.length}
          </div>
          <div className="rival-graveyard">
            {rivalGroundState.graveyardState.length}
          </div>
          <div className="rival-blackhole">
            {rivalGroundState.blackholeState.length}
          </div>
          <div className="rival-hand">
            {this.handCardGenerator(rivalGroundState.handState, false)}
          </div>
          <div className="rival-info">
            <p>{"命火: " + rivalBasicState.health}</p>
            <p>{"灵力: " + rivalBasicState.mana}</p>
            <p>{"修为: " + showLevel(rivalBasicState.level)}</p>
          </div>
        </div>
        {this.state.spotCardID !== -1 && spotCard != null? <CardDetail cardState={spotCard} /> :(this.state.showingCard!=null?<CardDetail cardState={this.state.showingCard} />:null)}
      </div>
    );
  }
}

export default GamePage;