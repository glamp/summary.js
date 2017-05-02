import React, { PropTypes, Component } from 'react';
import FontAwesome from 'react-fontawesome';
import _ from 'lodash';

import palettes from '../../services/palettes';

import Box from '../Box/Box';
import DraggableField from '../DraggableField/DraggableField';

export default class FieldList extends Component {
  static propTypes = {
    columns: PropTypes.array.isRequired,
    addDimension: PropTypes.func.isRequired,
  }

  getDimensionColumns() {
    return _.sortBy(this.props.columns.filter((i) => i.type==='categorical'), 'name');
  }

  getMeasureColumns() {
    return _.sortBy(this.props.columns.filter((i) => i.type!=='categorical'), 'name');
  }

  getIconType(datatype) {
    if (datatype==='date') {
      return 'calendar';
    }

    if (datatype==='number') {
      return 'hashtag';
    }

    if (datatype==='categorical') {
      return 'font';
    }

    return 'hashtag';
  }

  makeDraggableField(column) {
    return (
      <div key={`dimension-${column.name}`} style={{ marginBottom: 10 }}>
        <DraggableField name={column.name}
                        icon={<FontAwesome name={this.getIconType(column.type)} style={{ color: palettes.categorical(1)(0) }} />}
                        onClick={() => this.props.addDimension(null, column)}
                        onDrop={(dimension) => this.props.addDimension(dimension, column)} />
      </div>
    );
  }

  render() {
    return (
      <div>
        <Box alignment="text-left" style={{ height: 350, overflow: scroll }}>
          <p><b>Dimensions</b></p>
          {this.getDimensionColumns().map((column) => this.makeDraggableField(column))}
          </Box>
          <Box alignment="text-left" style={{ height: 350, overflow: scroll }}>
            <p><b>Measures</b></p>
          {this.getMeasureColumns().map((column) => this.makeDraggableField(column))}
          </Box>
      </div>
    );
  }
}
