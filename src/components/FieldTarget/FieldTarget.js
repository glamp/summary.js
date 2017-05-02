import React, { Component, PropTypes } from 'react';
import { DropTarget} from 'react-dnd';
const ItemTypes = { BOX: 'box' }

const boxTarget = {
  drop(props) {
    return props;
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
