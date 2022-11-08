import React from "react";
import { Component, ReactNode } from "react";
import './Popup.css';

export interface PopupWindowProps {
  popupCloseOnClick: () => void,
  children?: ReactNode
}

export class FilterBackground extends Component<{children?: ReactNode}> {
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
  btnComponent: ReactNode,
  windowComponent: ReactNode,
}

export interface PopupBtnState {
  showPopup: boolean,
}

export class PopupBtn extends React.Component<PopupBtnProps,PopupBtnState> {
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
