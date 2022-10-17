import React from "react";
import { Stage, Text, Layer, Line, Group, Rect } from 'react-konva';
import Board from './element/Board';
import { Slot } from './element/Board';
import CardContainer from './element/CardContainer';
import { GameState,Player } from "../regulates/Interfaces";
import { PlayerOperation } from "../regulates/signals";
import { PopupBtn } from "./Composition";
import PlayerList from "./element/PlayerList";
import GlobalState from "./element/GlobalState";
import TopTitle from "./element/TopTitle";

interface GamePageProps {
  gameState: GameState,
  signal: PlayerOperation,
}

interface GamePageState {
  showingCard: string | "",
  currentBoard: number,
  currentRound: number,
  currentPlayer: string,
}

interface UIProps {
  playerList: Player[],
  currentRound: number,
  currentPlayer: string,
  currentBoard: number,
}
class UI extends React.Component<UIProps> {
  constructor(props) {
    super(props)
  }
  render(): React.ReactNode {
      return (
        <Layer>
          <TopTitle
            currentBoard={this.props.currentBoard}
            currentPlayer={this.props.currentPlayer}
            currentRound={this.props.currentRound}></TopTitle>
          <PlayerList playList={ this.props.playerList }></PlayerList>
          <CardContainer></CardContainer>
        </Layer>
      )
  }
}

interface GameCanvasProps {
  currentBoard: number
  
}
interface GameCanvasState {
}
class GameCanvas extends React.Component<GameCanvasProps> {

  constructor(props) {
    super(props)
  }
  
  render(): React.ReactNode {
      return (
        <Layer draggable={true}>
          { this.boards[this.props.currentBoard]}
        </Layer>
      )
  }

  boards: Board[] = [
    <Board radius={2} slotTemplate={<Slot color='blue'></Slot> as unknown as Slot}></Board> as unknown as Board,
    <Board radius={3} slotTemplate={<Slot color='green'></Slot> as unknown as Slot}></Board> as unknown as Board,
    <Board radius={4} slotTemplate={<Slot color='red'></Slot> as unknown as Slot}></Board> as unknown as Board,
  ]
}

class GamePage extends React.Component<GamePageProps,GamePageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      showingCard: "",
      currentBoard: 0,
      currentPlayer: "1",
      currentRound: 1,
    };
    
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  render() {
    console.log(this.props.gameState);
    return (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <GameCanvas currentBoard={this.state.currentBoard}></GameCanvas>
          <UI
          currentBoard={this.state.currentBoard}
          currentPlayer={this.state.currentPlayer}
          currentRound={this.state.currentRound}
          playerList={this.props.gameState.player}></UI>
      </Stage>
      </div>
    );
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown)
  }
 
  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  handleKeyDown(e) {
    let lastBoard = this.state.currentBoard
    switch(e.keyCode) {
      case 38: this.setState({currentBoard:(lastBoard+2)%3}); this.setState({}); break;
      case 40: this.setState({currentBoard:(lastBoard+1)%3}); break;
    }
  }

}

export default GamePage;