import React from 'react';
import './App.css';
import LoginPage from './page/LoginPage';
import ErrorPage from './page/ErrorPage';
import GamePage from './page/GamePage';
import { GameStage, GameState, RoomState} from './regulates/Interfaces'
import { socket } from './communication/connection';
import { RoomPage } from './page/RoomPage';
import { PlayerOperation } from './regulates/signals';
import { GameEndPage } from './page/GameEndPage';
import { AlertWindow } from './page/Composition';
import PubSub from 'pubsub-js'

interface AppState {
  userName: string,
  pageName: string,
  gameState: GameState,
  signal: PlayerOperation,
  roomState: RoomState,
  gameResult: Record<string, number>,
  alertMessage: string | null,
}
// App: 是整个程序的主要类，这个类是整个 React 显示出的 html 的根。
class App extends React.PureComponent<{},AppState> {
  messageID: number = 0;
  setPage(val: string) {
    this.setState({pageName: val});
  }
  // Todo: setRoomState
  setRoomState(val: RoomState) {
    this.setState({roomState: val});
  }

  setGameState(val: GameState) {
    this.setState({gameState: val});
  }

  setSignal(val: PlayerOperation) {
    this.setState({signal: val});
  }

  setUserName(val: string) {
    this.setState({userName: val});
  }

  sendAlertMessage(msg: string, dur: number = 3) {
    this.setState({alertMessage: msg});
    const thisMsgID = (++this.messageID);
    setTimeout(() => {
      if(this.messageID === thisMsgID) {
        this.setState({alertMessage: null});
      }
    }, dur * 1000);
  }
  constructor(props: any){
    
    super(props);
    this.state = {
      pageName: "LoginPage",
      userName: "请登录",
      gameState: {
        player: [],
        board: [],
        toPlayer: 1,
        global: {
          round: 0,
          turn: 0,
          stage: 0,
          result: {}
        }
      },
      signal: PlayerOperation.NONE,
      roomState: {
        roomName: "",
        users: [],
      },
      gameResult: {},
      alertMessage: null,
    };
    this.setPage = this.setPage.bind(this);
    this.setGameState = this.setGameState.bind(this);
    this.setUserName = this.setUserName.bind(this);
    this.setRoomState = this.setRoomState.bind(this);

    // Register listeners on the messages that changes the whole application.
    
    socket.on("renew-game-state", (state) => {
      console.log(state);
      this.setGameState(state);
      this.setPage("GamePage");
    });
    socket.on("user-login-successful", (args) => {
      this.setUserName(args);
    });
    socket.on("renew-room-state", (args) => {
      this.setRoomState(args);
      this.setPage("RoomPage");
    });
    socket.on("room-game-end", (args) => {
      this.setPage("GameEndPage");
      this.setState({
        gameResult: args.gameResult,
        roomState: args.roomState,
      })
    })
    socket.on("leave-room-successful", () => {
      this.setPage("LoginPage");
      this.setRoomState({
        roomName: "",
        users: [],
      });
    });
    socket.on("alert-message", (args) => {
      PubSub.publish('alert-pubsub-message',args);
    });
  }

  componentDidMount(): void {
    PubSub.subscribe("alert-pubsub-message", (msg, data) => {
      this.sendAlertMessage(data);
    });
  }

  componentDidUnMount(): void {
    PubSub.clearAllSubscriptions();
  }

  render() {
    let content = null;
    switch(this.state.pageName){
      case "LoginPage":{
        content = <LoginPage userName={this.state.userName}/>;
        break;
      }
      case "GamePage":{
        content = <GamePage gameState={this.state.gameState} signal={this.state.signal}/>;
        break;
      }
      case "RoomPage":{
        content = <RoomPage roomState = {this.state.roomState}/>;
        break;
      }
      case "GameEndPage":{
        content = <GameEndPage backRoom = {() => {this.setPage("RoomPage")}} roomState={this.state.roomState}/>; 
        break;
      }
      default:{
        content = <ErrorPage reason={"PageNotFound"}></ErrorPage>;
      }
    }
    return <div>
      {this.state.alertMessage != null? <AlertWindow message = {this.state.alertMessage}/>: null}
      {content}
    </div>;
  }
}
export default App;