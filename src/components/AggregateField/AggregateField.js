import React, { Component, PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import './AggregateField.css';
import _ from 'lodash';


export default class AggregateField extends Component {
  static propTypes = {
    field: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = { value: 'avg' };
  }

  render() {
    var options = [
      { value: 'avg' },
      { value: 'sum' },
      { value: 'max' },
      { value: 'min' },
      { value: 'median' },
    ];
    options = _.map(options, (option) => {
      option.label = `${option.value}(${this.props.field.name})`;
      return option;
    });
    return (
      <Select clearable={false}
              searchable={false}
              options={options}
              value={this.state.value}
              onChange={(option) => this.setState({ value: option.value })}
       />
    );
  }
}
