import React from "react";
import { Stage} from 'react-konva';
import { GameState,Player } from "../regulates/Interfaces";
import { PlayerOperation } from "../regulates/signals";
import CardContainer from "./element/CardContainer";
import GameCanvas from "./element/GameCanvas";
import UI from "./element/UI";

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
    //console.log(this.props.gameState);
    return (
      <div>
        <Stage width={window.innerWidth} height={window.innerHeight}>
          <GameCanvas currentBoard={this.state.currentBoard}></GameCanvas>
          <UI
          currentBoard={this.state.currentBoard}
          currentPlayer={this.state.currentPlayer}
          currentRound={this.state.currentRound}
          playerList={this.props.gameState.player}
          ></UI>
      </Stage>
      </div>
    );
  }

  componentDidMount(){
    document.addEventListener("keydown", this.handleKeyDown)
    CardContainer.instance.setCard(["0","2","3","AH"])
  }
 
  componentWillUnmount(){
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  handleKeyDown(e) {
    let lastBoard = this.state.currentBoard
    switch(e.keyCode) {
      case 38: this.setState({currentBoard:(lastBoard+2)%3});break;
      case 40: this.setState({currentBoard:(lastBoard+1)%3}); break;
    }
  }

}

export default GamePage;