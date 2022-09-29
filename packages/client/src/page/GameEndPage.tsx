import React from "react";
import './GameEndPage.css';
import { RoomState } from "../regulates/Interfaces";
interface GameEndPageProps{
  roomState: RoomState,
  backRoom: () => void,
}
export class GameEndPage extends React.Component<GameEndPageProps,{}> {
  render(): React.ReactNode {
    return (
      <div className="game-end-scene">
        <div className="game-result">
          <p>{"游戏结束"}</p>
        </div>
        <div className="back-room-btn" onClick={this.props.backRoom}>
          返回房间
        </div>
      </div>
    );
  }
}