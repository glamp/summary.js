import React, { Component, PropTypes } from 'react';
import './charticon.css';

const icons = {
  histogram: require('./histogram.svg'),
  bar: require('./bar.svg'),
  horizontalbar: require('./horizontal-bar.svg'),
  line: require('./line.svg'),
  scatter: require('./scatter.svg')
}


export default class ChartIcon extends Component {

  handleClick = () => {
    if (this.props.isAvailable) {
      this.props.onClick();
    }
  }

  getClass() {
    if (this.props.isSelected) {
      return "selected";
    }
    if (this.props.isAvailable) {
      return "onhover";
    } else {
      return "unavailable";
    }
  }
  render() {
    var icon = <img className="icon" src={icons[this.props.type.toLowerCase()]} />
    return (
      <div onClick={this.handleClick} className={this.getClass()}>
        {icon}
        <p className={! this.props.isAvailable ? 'text-muted' : '' }>{this.props.type}</p>
        {this.props.children}
      </div>
    );
  }
}
