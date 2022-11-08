import { Component, ReactNode } from "react";
import './Composition.css';

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