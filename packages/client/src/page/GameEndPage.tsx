import React from "react";
import './GameEndPage.css';


import { GameResult, RoomState } from "../regulates/Interfaces";
interface GameEndPageProps{
  gameResult: GameResult,
  roomState: RoomState,
  backRoom: () => void,
}
export class GameEndPage extends React.Component<GameEndPageProps,{}> {
  render(): React.ReactNode {
    return (
      <div className="game-end-scene">
        <div className="game-result">
          <p>{"游戏结束"}</p>
          <p>
            {this.props.gameResult === GameResult.AWIN? this.props.roomState.users[0] + "胜利":
              (this.props.gameResult === GameResult.BWIN? this.props.roomState.users[1] + "胜利": "平局")}
          </p>
        </div>
        <div className="back-room-btn" onClick={this.props.backRoom}>
          返回房间
        </div>
      </div>
    );
  }
}