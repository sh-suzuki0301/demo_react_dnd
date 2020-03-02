import React, { Component } from "react";
import { DragSource, DropTarget } from "react-dnd";

const dragSource = DragSource(
  "item",
  {
    beginDrag(props) {
      return {
          id: props.id,
          name: props.name,
          originalIndex: props.findItem(props.id),
      };
  },

  endDrag(props, monitor) {
    const { id, originalIndex } = monitor.getItem()
    const didDrop = monitor.didDrop()

    if (!didDrop) {
        props.onDrop(id, originalIndex)
    }
  },
}, (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    };
});

const dropTarget = DropTarget("item", {
    canDrop() {
        return false
    },
    hover(props, monitor) {
      const draggedId = monitor.getItem().id
      const overId = props.id

      if (draggedId !== overId) {
        const overIndex = props.findItem(overId)
        props.onDrop(draggedId, overIndex)
      }
    },
    
  },connect => {
    return {
      connectDropTarget: connect.dropTarget()
    };
  }
);

class DragItem extends Component {
  constructor(props) {
    super(props);
  }

  getItemStyles() {
    const { isDragging } = this.props;

    return {
      opacity: isDragging ? 0.4 : 1
    };
  }

  render() {
    return this.props.connectDragSource(
      this.props.connectDropTarget(
        <div style={this.getItemStyles()}>{this.props.name}</div>
      )
    );
  }
}

export default dragSource(dropTarget(DragItem));
