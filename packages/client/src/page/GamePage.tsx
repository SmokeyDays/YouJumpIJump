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
import { Player } from "../regulates/Interfaces";
//import Bgm from "../assets/musics/bgm.flac"


export let LocalPlayer = null
export let CurrentBoard = 2
export let viewLocked = false

interface GamePageProps {
  gameState: GameState,
  localPlayer: number,
  changePage: (page: string, rank: number) => void,
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
        new BoardInfo(2 * (this.props.gameState.player.length - 1) + 4, 'white', '#FF4500', <Slot color='#66cdaa'></Slot>),
        new BoardInfo(2 * (this.props.gameState.player.length - 1) + 3, 'white', '#FF4500', <Slot color='#20b2aa'></Slot>),
        new BoardInfo(2 * (this.props.gameState.player.length - 1) + 2, 'white', '#FF4500', <Slot color='#008b8b'></Slot>),
      ],
      showingCard: "",
      currentBoard: 2,
      currentRound: 1,
      accessSlotList: [[], [], []],
      freSlotList: [[], [], []],
      gameState: this.props.gameState,
      isInRecast: false,
      stage: -1
    };

    //this.state.gameState.global.turn=-1

    LocalPlayer = this.props.localPlayer;

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.addCurrentBoard = this.addCurrentBoard.bind(this)
    this.minusCurrentBoard = this.minusCurrentBoard.bind(this)
  }

  render() {
    return (
      <div>
        <audio
          autoPlay={true}
          loop={true}
          preload="auto"
          src={require("../assets/musics/bgm.flac")}>
        </audio>
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

  publishPlayerChange(player1: Player, player2: Player) {
    if (this.state.gameState.global.round < this.state.gameState.player.length) return;
    if (player1.alive != player2.alive) {
      PubSub.publish('alert-pubsub-message', { str: `${player1.name}被淘汰了!`, dur: 1 })
    }
    if (player2.magician && !player1.magician) {
      PubSub.publish('alert-pubsub-message', { str: `${player1.name}获得了悬浮状态`, dur: 1 })
    }
    if (player2.position[0] != player1.position[0]) {
      PubSub.publish('alert-pubsub-message', { str: `${player1.name}的层数发生了改变`, dur: 1 })
    }
    else if (player2.position[1] != player1.position[1] || player2.position[2] != player1.position[2]) {
      PubSub.publish('alert-pubsub-message', { str: `${player1.name}移动了`, dur: 1 })
    }
  }

  loadGameState(state: GameState) {

    let boards = state.board
    console.log("Boardnew", boards)
    for(let i in this.state.gameState.player) {
      this.publishPlayerChange(this.state.gameState.player[i],state.player[i])
      console.log("publishPlayerChange", this.state.gameState.player[i],state.player[i])
    }

    for (let index in boards) {
      let pos = index.split(',')
      let i = Number(pos[0]), j = Number(pos[1]), k = Number(pos[2]);
      this.state.boards[i].setSlotStatus(j, k, boards[index].isBursted);
    }
    if (CardContainer.instance != null) {
      CardContainer.instance.setCard(state.player[LocalPlayer].hand);
    }
    if(!state.player[LocalPlayer].alive) {
      this.props.changePage("GameEndPage",this.state.gameState.global.result[state.player[LocalPlayer].name])
    }
    this.setState({})
  }

  componentDidMount() {
    socket.on('renew-game-state', (val: { state: GameState, localPlayer: number }) => {
      console.log('!!!renew-game-state', val);
      this.loadGameState(val.state)
      this.setState({ gameState: val.state })
    })
    socket.on('request-signal', (val: SignalPara) => {
      console.log('!!!request-signal', val);
      switch (val.type) {
        case 'recast':
          this.setState({ isInRecast: true })
          break;
        case 'card':
          if (val.stage == 'main') {
            this.setState({ stage: 1 })
          }
          else {
            this.setState({ stage: 0 })
          }
          break;
        case 'action':
          this.setAccessSlotList(val.pos)
          break;
      }
    })

    socket.on('return-pos-set', (val: Position[]) => {
      console.log('!!!return-pos-set', val);
      this.setFreSlotList(val)
    })
    
    socket.on('game-end-signal', (state: GameState)=>{
      console.log('game-end-signal', state.global.result[state.player[LocalPlayer].name]);
      this.props.changePage('GameEndPage',state.global.result[state.player[LocalPlayer].name])
    })

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

  addCurrentBoard() {
    let lastBoard = this.state.currentBoard
    this.setCurrentBoard((lastBoard + 1) % this.state.boards.length);
  }

  minusCurrentBoard() {
    let lastBoard = this.state.currentBoard
    this.setCurrentBoard((lastBoard + this.state.boards.length - 1) % this.state.boards.length);
  }

  handleKeyDown(e) {
    
    switch (e.keyCode) {
      case 38: this.addCurrentBoard(); break;
      case 40: this.minusCurrentBoard(); break;
      case 39: this.props.changePage('GameEndPage',1);break;
    }
  }

  isInRecast(): boolean {
    return this.state.isInRecast;
  }

  setInRecast(val: boolean): void {
    this.setState({ isInRecast: val })
  }


}

export default GamePage;