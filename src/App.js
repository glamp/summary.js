import React, { Component } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { Button } from 'react-bootstrap';
import Cuadro from './components/Cuadro/Cuadro';
import getDndContext from './services/dnd-global-context';

const diamonds = require('../datasets/diamonds.json');
const diamondsSmall = require('../datasets/diamonds-small.json');
const iris = require('../datasets/iris.json');
const meat = require('../datasets/meat.json');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { dataset: diamonds };
  }

  getChildContext() {
    return {
      dragDropManager: getDndContext(),
    };
  }

  render() {
    return (
      <div>
        <div>
          <Button onClick={() => this.setState({ dataset: diamonds })} bsStyle="default" bsSize="small">diamonds</Button>
          <Button onClick={() => this.setState({ dataset: diamondsSmall })} bsStyle="primary" bsSize="small">diamonds-small</Button>
          <Button onClick={() => this.setState({ dataset: iris })} bsStyle="info" bsSize="small">iris</Button>
          <Button onClick={() => this.setState({ dataset: meat })} bsStyle="dark" bsSize="small">meat</Button>
          <Cuadro dataset={this.state.dataset} />
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  dragDropManager: React.PropTypes.object.isRequired,
}

export default App;
