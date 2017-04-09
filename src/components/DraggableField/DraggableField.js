import React, { Component, PropTypes } from 'react';
import { DropTarget, DragSource, DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
const ItemTypes = { DraggableField: 'box' }
import './DraggableField.css';


const style = {
  cursor: 'move',
  // border: '1px dashed gray',
  // backgroundColor: 'white',
  // padding: '0.5rem 1rem',
  // marginRight: '1.5rem',
  // marginBottom: '1.5rem',
  // float: 'left',
};

const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
    };
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      props.onDrop && props.onDrop(dropResult.dimension);
    } else {
      props.removeDimension && props.removeDimension();
    }
  },
};

class DraggableField extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { name, icon } = this.props;
    const opacity = isDragging ? 0.4 : 1;

    if (! name) {
      return <p className="text-center text-muted field-empty">{this.props.dimension}</p>
    }

    return (
      connectDragSource(
        <div className={this.props.dimension && "field-selected"} onClick={this.props.onClick} style={{ ...style, opacity }}>
          {icon}
          {' '}
          {name}
        </div>,
      )
    );
  }
}

DraggableField = DragSource(ItemTypes.DraggableField, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DraggableField)

export default DraggableField;
