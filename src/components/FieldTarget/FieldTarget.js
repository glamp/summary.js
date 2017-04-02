import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
const ItemTypes = { BOX: 'box' }

const style2 = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

const boxTarget = {
  drop() {
    return { name: 'FieldTarget' };
  },
};



class FieldTarget extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
  };

  render() {
    const { canDrop, isOver, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;

    let backgroundColor = null;
    if (isActive) {
      backgroundColor = null;
    } else if (canDrop) {
      backgroundColor = null;
    }

    return connectDropTarget(
      <div style={{ backgroundColor }}>
        {this.props.children}
      </div>,
    );
  }
}

FieldTarget = DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(FieldTarget);
export default FieldTarget;
