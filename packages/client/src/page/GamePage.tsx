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
          <GameCanvas
          x={window.innerWidth/2}
          y={window.innerHeight/2}
          ></GameCanvas>
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

  setCurrentBoard(index: number) {
    this.setState({currentBoard:index})
    GameCanvas.instance.setCurrentBoard(index)
  }

  handleKeyDown(e) {
    let lastBoard = this.state.currentBoard
    console.log('key:'+e.keyCode)
    switch(e.keyCode) {
      case 38: this.setCurrentBoard((lastBoard+2)%3);break;
      case 40: this.setCurrentBoard((lastBoard+1)%3); break;
    }
  }

}

export default GamePage;