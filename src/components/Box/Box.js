import React, { Component, PropTypes } from 'react';
import './box.css';


export default class Box extends Component {
  render() {
    var klasses = ['component-box'];
    if (this.props.className) {
      klasses.push(this.props.className);
    }
    if (this.props.alignment) {
      klasses.push(this.props.alignment);
    } else {
      klasses.push('text-center');
    }
    return (
      <div className={klasses.join(' ')} style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}
