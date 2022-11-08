import React from "react";
import { Stage } from 'react-konva';
import { GameState } from "../regulates/Interfaces";
import { PlayerOperation } from "../regulates/signals";
import CardContainer from "./element/CardContainer";
import GameCanvas from "./element/GameCanvas";
import UI from "./element/UI";
import { BoardInfo, Slot } from "./element/Board";
import { socket } from "../communication/connection";
import { Card, CardPara, Position, RequestSignal, SignalPara } from "../../../core/src/regulates/interfaces";
import { BlockLike } from "typescript";
import { Player } from "../../../core/src/player";


export let LocalPlayer = null
export let CurrentBoard = 2
export let viewLocked = false

interface GamePageProps {
  gameState: GameState,
  localPlayer: number,
}

interface GamePageState {
  boards: BoardInfo[],
  showingCard: string | "",
  currentBoard: number,
  currentRound: number,
  accessSlotList: string[][],
  freSlotList: string[][],
  gameState: GameState,
  isInRecast: boolean,
  stage: number,
}

class GamePage extends React.Component<GamePageProps, GamePageState> {

  static instance: GamePage

  constructor(props: any) {
    super(props);
    GamePage.instance = this
    this.state = {
      boards: [
        new BoardInfo(2 * (this.props.gameState.player.length - 1) +4, 'white', 'green', <Slot color='MediumAquamarine'></Slot>),
        new BoardInfo(2 * (this.props.gameState.player.length - 1) +3, 'white', 'green', <Slot color='LightSeaGreen'></Slot>),
        new BoardInfo(2 * (this.props.gameState.player.length - 1) +2, 'white', 'green', <Slot color='DarkCyan'></Slot>),
      ],
      showingCard: "",
      currentBoard: 2,
      currentRound: 1,
      accessSlotList: [[], [], []],
      freSlotList: [[], [], []],
      gameState: this.props.gameState,
      isInRecast: false,
      stage: 0
    };

    //this.state.gameState.global.turn=-1
        
    LocalPlayer = this.props.localPlayer;

    socket.on('renew-game-state', (val: { state: GameState, localPlayer: number }) => {
      console.log('!!!renew-game-state',val);
      this.loadGameState(val.state)
      this.setState({ gameState: val.state })
    })
    socket.on('request-signal', (val: SignalPara) => {
      console.log('!!!request-signal',val);
      switch (val.type) {
        case 'recast':
          this.setState({isInRecast: true})
          break;
        case 'card':
          if (val.stage=='main') {
            this.setState({stage:1})
          }
          else {
            this.setState({stage:0})
          }
          break;
        case 'action':
          this.setAccessSlotList(val.pos)
          break;
      }
    })
    
  socket.on('return-pos-set', (val: Position[]) => {
    console.log('!!!return-pos-set',val);
    this.setFreSlotList(val)
  })
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  render() {
    // console.log(this.props.gameState);
    return (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <GameCanvas
            freSlotList={this.state.freSlotList[this.state.currentBoard]}
            currentBoard={this.state.currentBoard}
            x={window.innerWidth / 2}
            y={window.innerHeight / 2}
            boardInfo={this.state.boards[this.state.currentBoard]}
            accessSlotList={this.state.accessSlotList[this.state.currentBoard]}
            playerState={this.state.gameState.player.map(
              (v, i) => v.alive && v.position[0] === this.state.currentBoard && v)}
          ></GameCanvas>
          <UI
          
            isInRecast={this.state.isInRecast}
            stage={this.state.stage}
            currentBoard={this.state.currentBoard}
            turn={this.state.gameState.global.turn}
            currentRound={this.state.gameState.global.round}
            playerList={this.props.gameState.player.map(
              (v) => {
                let pos = v.position
                return {
                  ...v,
                  numberPos: this.state.boards[pos[0]].slotMap[`${pos[1]},${pos[2]}`]
                }
              })}
          ></UI>
        </Stage>
      </div>
    );
  }

  isPlayerEqual(id:number, player1: Player, player2: Player): boolean {
    if(player1.alive!=player2.alive) {
      PubSub.publish('alert-pubsub-message',{str:`${player1.name}被淘汰了!`,dur:3})
    }
    if(player2.magician && !player1.magician) {
      PubSub.publish('alert-pubsub-message',{str:`${player1.name}获得了悬浮状态`,dur:3})
    }
    return true;
  }

  loadGameState(state: GameState) {
      let boards = state.board
      console.log("Boardnew",boards)
      for( let index in boards) {
        let pos = index.split(',')
        let i = Number(pos[0]),j=Number(pos[1]),k=Number(pos[2]);
        //this.state.boards[i].setSlotStatus(Number(j),Number(k),boards[i][j][k].isBursted)
        this.state.boards[i].setSlotStatus(j,k,!boards[index].isBursted);
      }
      CardContainer.instance.setCard(state.player[LocalPlayer].hand);

  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown)
    if (CardContainer.instance != null) {
      this.loadGameState(this.state.gameState)
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  setCurrentBoard(index: number) {
    CurrentBoard = index
    this.setState({ currentBoard: index })
  }

  setAccessSlotList(slotList: [number, number, number][]) {
    let tmp: string[][] = [[], [], []]
    for (let i of slotList) {
      tmp[i[0]].push(`${i[1]},${i[2]}`)
    }
    this.setState({ accessSlotList: tmp })
  }

  setFreSlotList(slotList: [number, number, number][]) {
    let tmp: string[][] = [[], [], []]
    for (let i of slotList) {
      tmp[i[0]].push(`${i[1]},${i[2]}`)
    }
    this.setState({ freSlotList: tmp })
  }

  setSlotStatus(level: number, x: number, y: number, isBroken: boolean) {
    this.state.boards[level].setSlotStatus(x, y, isBroken)
    this.setState({})
  }

  handleKeyDown(e) {
    let lastBoard = this.state.currentBoard
    switch (e.keyCode) {
      case 38: this.setCurrentBoard((lastBoard + 1) % this.state.boards.length); break;
      case 40: this.setCurrentBoard((lastBoard + this.state.boards.length - 1) % this.state.boards.length); break;
      case 37: LocalPlayer = 1;
        this.setState({}); break;
      case 39: this.state.gameState.player[1].alive = false
        this.setState({}); break;
    }
  }

  isInRecast(): boolean {
    return this.state.isInRecast;
  }

  setInRecast(val: boolean): void {
    this.setState({isInRecast: val})
  }

  
}

export default GamePage;