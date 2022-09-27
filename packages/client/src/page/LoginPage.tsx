import React from 'react';
import logo from '../assets/logos/lowlogo.png';
import './LoginPage.css';
import internal from 'stream';
import { Message, socket } from '../communication/connection';
import { GameState } from '../regulates/Interfaces';
import { getUUID } from '../regulates/utils';

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
      <div>
        <form className="basic-info-form">
          <label>
            {this.props.formName}
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
          <img src={logo} className="login-logo" alt="logo"></img>
          <BasicInfoForm
            formName='用户登陆'
            buttonName='登陆'
            formVariables={{
              userName: this.props.userName,
            }}
            formClassName='basic-info-form'
            formButtonOnClick={this.userLoginOnClick}/>
          <BasicInfoForm
            formName='房间号'
            buttonName='创建/进入'
            formVariables={{
              roomName: this.randomRoomName,
            }}
            formClassName='basic-info-form'
            formButtonOnClick={this.enterRoomOnClick}/>
        </header>
      </div>
    );
  }
}

export default LoginPage;
