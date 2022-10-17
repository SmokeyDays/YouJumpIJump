import { Component, ReactNode } from "react";
import './Composition.css';

export interface PopupWindowProps {
  popupCloseOnClick: () => void,

}

export class FilterBackground extends Component {
  render(): ReactNode {
    return (
      <div className="filter-background">
        {this.props.children}
      </div>
    )
  }
}

export class PopupWindow extends Component<PopupWindowProps,{}> {
  render(): ReactNode {
    return (
      <FilterBackground>
        <div className='popup-window'>
          {this.props.children}
          <div className='popup-close' onClick={this.props.popupCloseOnClick}>✖</div>
        </div>
      </FilterBackground>
    );
  }
}

// It's bad to use "any", but I don't exactly know what to use.
export interface PopupBtnProps {
  btnComponent: any,
  windowComponent: any,
}

export interface PopupBtnState {
  showPopup: boolean,
}

export class PopupBtn extends Component<PopupBtnProps,PopupBtnState> {
  constructor(props: any) {
    super(props);
    this.state = {
      showPopup: false,
    }
    this.changeVisuality = this.changeVisuality.bind(this);
  }

  changeVisuality(val: boolean) {
    this.setState({showPopup: val});
    console.log(val);
  }
  
  render() {
    return (
      <div>
        <div className="popup-btn" onClick={() => this.changeVisuality(true)}>
          {this.props.btnComponent}
        </div>
        {this.state.showPopup? 
        (<PopupWindow popupCloseOnClick={() => this.changeVisuality(false)}>
          {this.props.windowComponent}
        </PopupWindow>): (<div></div>)}
      </div>
    );
  }
}

interface AlertWindowProps {
  message: string,
}

export class AlertWindow extends Component<AlertWindowProps, {}> {
  render(): React.ReactNode {
    return (
      <div className='alert-message-window'>
        <div className='alert-message-content'>
          {this.props.message}
        </div>
      </div>
    )
  }
}