import React from "react";
import { Stage, Text, Layer, Line, Group, Rect } from 'react-konva';
import Board from './element/Board';
import { Slot } from './element/Board';
import CardContainer from './element/CardContainer';
import { GameState } from "../regulates/Interfaces";
import { PlayerOperation } from "../regulates/signals";
import { PopupBtn } from "./Composition";
import PlayerList from "./element/PlayerList";

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
        <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <PlayerList playList={this.props.gameState.player}></PlayerList>
          <CardContainer></CardContainer>
        </Layer>
        <Layer>
          {this.boards}
        </Layer>
      </Stage>
      </div>
    );
  }

  boards: Board[] = [
    <Board radius={5} slotTemplate={<Slot color='blue'></Slot> as unknown as Slot}></Board> as unknown as Board,
    <Board radius={4} slotTemplate={<Slot color='green'></Slot> as unknown as Slot}></Board> as unknown as Board,
    <Board radius={3} slotTemplate={<Slot color='red'></Slot> as unknown as Slot}></Board> as unknown as Board,
  ]
}

export default GamePage;