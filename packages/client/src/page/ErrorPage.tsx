import React from 'react';
import logo from '../assets/lowlogo.png';
import './ErrorPage.css';
import internal from 'stream';

interface ErrorPageProps {
  reason: string;
}

class ErrorPage extends React.Component<ErrorPageProps,{}> {
  render() {
    return (
      <div className="error-scene">
        {this.props.reason}
      </div>
    );
  }
}

export default ErrorPage;