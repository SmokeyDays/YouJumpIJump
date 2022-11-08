import { Component, ReactNode } from "react";
import './Composition.css';

interface AlertWindowProps {
  message: string,
  shown: boolean,
}

export class AlertWindow extends Component<AlertWindowProps, {}> {
  render(): React.ReactNode {
    return (
      <div className={`alert-message-window ${this.props.shown ? "shown" : "hidden"}`}>
        <div className='alert-message-content'>
          {this.props.message}
        </div>
      </div>
    )
  }
}