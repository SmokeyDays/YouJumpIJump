import React from 'react';
import logo from '../assets/logos/lowlogo.png';
import './LoginPage.css';
import internal from 'stream';
import { Message, socket } from '../communication/connection';
import { GameState } from '../regulates/Interfaces';
import { getUUID } from '../regulates/utils';
import { PopupBtn } from './element/Popup';
import helpSvg from "../assets/icons/help.svg";
import infoSvg from "../assets/icons/info.svg";

/* 主页面对应的 React 控件 */

interface FormState {
  value: Record<string,string>;
}

interface FormProps {
  formName: string,
  buttonName: string,
  formVariables: Record<string,string>
  formClassName: string,
  formButtonOnClick: (info: Record<string,string>) => void
}

class BasicInfoForm extends React.Component<FormProps,FormState> {
  constructor(props: any) {
    super(props);
    this.state = {
      value: this.props.formVariables,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.buttonClick = this.buttonClick.bind(this)
  }

  handleInputChange(event: any) {
    const target = event.target;

    const value:string = target.value;
    const name = target.name;

    const nowValue = this.state.value;
    nowValue[name] = value;
    this.setState({
      value: nowValue
    } as any);
  }

  buttonClick() {
    this.props.formButtonOnClick(this.state.value);
  }

  inputGenerator(val: Record<string,string>) {
    const inputs = [];
    for(const i in val) {
      inputs.push(<input
        key={i}
        className= 'basic-info-input'
        name = {i}
        type = "text"
        value = {val[i]}
        onChange={this.handleInputChange}/>);
    }
    return inputs;
  }

  render() {
    return (
      <div className="basic-info-form-container">
        <form className="basic-info-form" onKeyDown = {
          (event) => {
            event.preventDefault()
            if(event.key === "Enter") {
              this.buttonClick();
            }
          }
        }>
          <label>
            <span>{this.props.formName}</span>
            {this.inputGenerator(this.state.value)}
          </label>
        </form>
        <div className="basic-info-button" onClick={this.buttonClick}>{this.props.buttonName}</div>
      </div>
    );
  }
}

interface LoginPageProps {
  userName: string,
  userLoggedIn: boolean,
}

class LoginPage extends React.Component<LoginPageProps,{}> {
  randomRoomName = "Room-" + getUUID();
  constructor(props: any) {
    super(props);
    // this.enterGameOnClick = this.enterGameOnClick.bind(this);
    this.userLoginOnClick = this.userLoginOnClick.bind(this);
    this.enterRoomOnClick = this.enterRoomOnClick.bind(this);
  }

  userLoginOnClick(info: Record<string, string>) {
    socket.emit("user-login", info["userName"]);
  }

  enterRoomOnClick(info: Record<string, string>) {
    socket.emit("join-room", info["roomName"]);
  }

  render() {
    return (
      <div className="login-scene">
        <header className="login-header">
          <PopupBtn btnComponent={
            <img src = {helpSvg} className="help-btn" alt = "help"></img>
          } windowComponent={
            <div className="help-popup">
              《你跳我也跳》是由你跳我也跳制作组自主研发的一款全新 PVP 策略游戏。游戏发生在一个被称作「多层棋盘」的幻想世界，在这里，有天赋的人将被放入棋盘，不断跳跃求生。你将扮演一位名为「玩家」的神秘角色，在多层棋盘上邂逅性格各异、能力独特的卡牌们，和他们一起击败各路对手，发现更深层的棋盘——同时，逐步发掘「最终胜利」的真相。<br/><br/>
              你的目标：不要掉出棋盘外<br/>
              你的能力：认真读读你抽的牌<br/>
              你的弱点：踩过的格子都会裂开<br/>
              提示：动起来！
            </div>
          }/>
          <PopupBtn btnComponent={
            <img src = {infoSvg} className="info-btn" alt = "info"></img>
          } windowComponent={
            <div className="info-popup">
              Credits:<br/>
              冯业齐：策划，架构，大厅编写<br/>
              李诗阳：前端编写<br/>
              陈开宇：游戏内核编写<br/>
              黄浚源：PM，材料撰写，联合调试<br/>
              特别鸣谢： hotwords 对 UI 作出的贡献<br/>
            </div>
          }/>
          <img src={logo} className="login-logo" alt="logo"></img>
          {!this.props.userLoggedIn && <BasicInfoForm
            formName='用户登录'
            buttonName='登录'
            formVariables={{
              userName: this.props.userName,
            }}
            formClassName='basic-info-form'
            formButtonOnClick={this.userLoginOnClick}/>}
          {this.props.userLoggedIn && <BasicInfoForm
            formName='房间号'
            buttonName='创建/进入'
            formVariables={{
              roomName: this.randomRoomName,
            }}
            formClassName='basic-info-form'
            formButtonOnClick={this.enterRoomOnClick}/>}
        </header>
      </div>
    );
  }
}

export default LoginPage;
