import React from "react";
import { Stage, Text, Layer, Line, Group, Rect } from 'react-konva';
import Board from './element/Board';
import { Slot } from './element/Board';
import CardContainer from './element/CardContainer';
import { GameState } from "../regulates/Interfaces";
import { PlayerOperation } from "../regulates/signals";
import { PopupBtn } from "./Composition";

interface GamePageProps {
  gameState: GameState,
  signal: PlayerOperation,
}

interface GamePageState {
  showingCard: string | "",
}

class GamePage extends React.Component<GamePageProps,GamePageState> {

  constructor(props: any) {
    super(props);
    this.state = {
      showingCard: "",
    };
  }

  render() {
    console.log(this.props.gameState);
    return (
      <div>
        <h1> test2</h1>
        {JSON.stringify(this.props.gameState)}
        
        <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          {this.boards}
        </Layer>
      </Stage>
      </div>
    );
  }

  boards: Board[] = [
    <Board radius={3} x={300} y={300} slotTemplate={<Slot color='red'></Slot> as unknown as Slot}></Board> as unknown as Board,
    <Board radius={4} x={700}  y={300} slotTemplate={<Slot color='green'></Slot> as unknown as Slot}></Board> as unknown as Board,
    <Board radius={5} x={1200} y={300} slotTemplate={<Slot color='blue'></Slot> as unknown as Slot}></Board> as unknown as Board
  ]
}

export default GamePage;