import React, { Component, PropTypes } from 'react';
import './box.css';


export default class Box extends Component {
  render() {
    return (
      <div className={this.props.className + " text-center component-box"} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
