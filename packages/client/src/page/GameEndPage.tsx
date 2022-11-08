import React from "react";
import './GameEndPage.css';
import { RoomState } from "../regulates/Interfaces";
interface GameEndPageProps {
  roomState: RoomState,
  backRoom: () => void,
  rank: number
}
export class GameEndPage extends React.Component<GameEndPageProps, {}> {
  render(): React.ReactNode {
    return (
      <div className="game-end-scene">
        <div className="game-result">
          <p>{"游戏结束"}</p>
              <p className="rank-display">{`您的排名是${this.props.rank}`}</p>
              {this.props.rank == 1 ? <p className="rank-one">{`恭喜你吃鸡, 欢迎再次吃鸡`}</p> : <p className="rank-display">{`欢迎再次来玩`}</p>}
          </div>
          <div className="back-room-btn" onClick={this.props.backRoom}>
            返回房间
          </div>
        </div>
        );
  }
}