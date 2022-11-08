import React from "react";
import { socket } from "../communication/connection";
import { RoomState } from "../regulates/Interfaces";
import { Deck } from "../regulates/type";
import './RoomPage.css';

interface RoomPageProps {
  roomState: RoomState,
}

export class RoomPage extends React.Component<RoomPageProps,{}> {
  constructor(props: any) {
    super(props);
    this.startGameOnClick = this.startGameOnClick.bind(this);
    this.leaveRoomOnClick = this.leaveRoomOnClick.bind(this);
  }

  startGameOnClick() {
    socket.emit('room-start-game');
  }

  leaveRoomOnClick() {
    socket.emit('leave-room');
  }

  render() {
    const roomState = this.props.roomState;
    const userList = roomState.users.map((val) => {
      return (
        <div key={val} className="room-user-box">
          <div className="room-user-name">{val}</div>
        </div>
      );
    })
    return (
      <div className="room-scene">
        <div className="room-title">
          {roomState.roomName}
        </div>
        <div className="room-body">
          {[userList]}
        </div>
        <div className="room-bottom">
          <div className="room-button enter" onClick = {this.startGameOnClick}>
            进入游戏
          </div>
          <div className="room-button exit" onClick = {this.leaveRoomOnClick}>
            退出房间
          </div>
        </div>
      </div>
    )
  }
}