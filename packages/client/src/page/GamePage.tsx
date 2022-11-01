import React from "react";
import { Stage } from 'react-konva';
import { GameState } from "../regulates/Interfaces";
import { PlayerOperation } from "../regulates/signals";
import CardContainer from "./element/CardContainer";
import GameCanvas from "./element/GameCanvas";
import UI from "./element/UI";
import { BoardInfo, Slot } from "./element/Board";
import { sensitiveHeaders } from "http2";

interface GamePageProps {
  gameState: GameState,
  signal: PlayerOperation,
}

interface GamePageState {
  boards: BoardInfo[],
  showingCard: string | "",
  currentBoard: number,
  currentRound: number,
  currentPlayer: string,
  accessSlotList: string[][],
  gameState: GameState,
  signal: PlayerOperation,
}
class GamePage extends React.Component<GamePageProps, GamePageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      boards: [
        new BoardInfo(2, 'white', 'green', <Slot color='MediumAquamarine'></Slot>),
        new BoardInfo(3, 'white', 'green', <Slot color='LightSeaGreen'></Slot>),
        new BoardInfo(4, 'white', 'green', <Slot color='DarkCyan'></Slot>),
      ],
      showingCard: "",
      currentBoard: 0,
      currentPlayer: "1",
      currentRound: 1,
      accessSlotList: [[], [], []],
      gameState: this.props.gameState,
      signal: this.props.signal
    };

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  render() {
    //console.log(this.props.gameState);
    return (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <GameCanvas
            x={window.innerWidth / 2}
            y={window.innerHeight / 2}
            boardInfo={this.state.boards[this.state.currentBoard]}
            accessSlotList={this.state.accessSlotList[this.state.currentBoard]}
            playerState={this.state.gameState.player.map(
              (v, i) => v.alive && v.position[0] == this.state.currentBoard && v)}
          ></GameCanvas>
          <UI
            currentBoard={this.state.currentBoard}
            currentPlayer={this.state.currentPlayer}
            currentRound={this.state.currentRound}
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

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown)
    CardContainer.instance.setCard(["0", "2", "3", "AH"])
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  setCurrentBoard(index: number) {
    this.setState({ currentBoard: index })
  }

  setAccessSlotList(slotList: [number, number, number][]) {
    let tmp: string[][] = [[], [], []]
    for (let i of slotList) {
      tmp[i[0]].push(`${i[1]},${i[2]}`)
    }
    this.setState({ accessSlotList: tmp })
  }


  setSlotStatus(level: number, x: number, y: number, isBroken: boolean) {
    this.state.boards[level].setSlotStatus(x, y, isBroken)
    this.setState({})
  }

  handleKeyDown(e) {
    let lastBoard = this.state.currentBoard
    console.log('key:' + e.keyCode)
    switch (e.keyCode) {
      case 38: this.setCurrentBoard((lastBoard + 2) % 3); break;
      case 40: this.setCurrentBoard((lastBoard + 1) % 3); break;
      case 37: this.state.gameState.player[1].position = [1, 0, 2];
        this.state.gameState.player[1].prayer = 3;
        this.state.gameState.player[2].position = [0, 1, 1];
        this.setState({}); break;
    }
  }

}

export default GamePage;