import React from 'react';
import './App.css';
import './page/BackgroundLayer.css';
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
  userLoggedIn: boolean,
  gameState: GameState,
  signal: PlayerOperation,
  roomState: RoomState,
  gameResult: Record<string, number>,
  alertMessage: string | null,
  localPlayer: number,
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

  setGameState(val: GameState, localPlayer: number) {
    this.setState({gameState: val, localPlayer: localPlayer});
  }

  setSignal(val: PlayerOperation) {
    this.setState({signal: val});
  }

  setUserName(val: string, loggedIn: boolean = false) {
    this.setState(s => ({
      userName: val,
      userLoggedIn: s.userLoggedIn || loggedIn
    }));
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
      userLoggedIn: false,
      gameState: {
        player: [],
        board: {},
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
      localPlayer: 0
    };
    this.setPage = this.setPage.bind(this);
    this.setGameState = this.setGameState.bind(this);
    this.setUserName = this.setUserName.bind(this);
    this.setRoomState = this.setRoomState.bind(this);
  }

  componentDidMount(): void {
    // Register listeners on the messages that changes the whole application.
    socket.on("renew-game-state", (val) => {
      this.setGameState(val.state, val.localPlayer);
      this.setPage("GamePage");
    });
    socket.on("user-login-successful", (args) => {
      this.setUserName(args, true);
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
      PubSub.publish('alert-pubsub-message',{
        str: args,
        dur: 1,
      });
    });

    PubSub.subscribe("alert-pubsub-message", (msg, data) => {
      if(data.dur === undefined) {
        this.sendAlertMessage(data.str);
      } else {
        this.sendAlertMessage(data.str, data.dur)
      }
    });
  }

  componentDidUnMount(): void {
    PubSub.clearAllSubscriptions();
  }

  render() {
    let content = null;
    switch(this.state.pageName){
      case "LoginPage":{
        content = (
          <div className="background-layer">
            <LoginPage userName={this.state.userName} userLoggedIn={this.state.userLoggedIn}/>
          </div>
        );
        break;
      }
      case "GamePage":{
        content = <GamePage gameState={this.state.gameState} localPlayer={this.state.localPlayer}/>
        break;
      }
      case "RoomPage":{
        content = (
          <div className="background-layer">
            <RoomPage roomState = {this.state.roomState}/>;
          </div>
        );
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