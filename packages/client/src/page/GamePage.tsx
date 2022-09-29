import React from "react";
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
        {JSON.stringify(this.props.gameState)}
      </div>
    );
  }
}

export default GamePage;