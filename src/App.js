import React, { Component } from 'react';
import 'bootswatch/lumen/bootstrap.css';
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
    this.state = { dataset: diamondsSmall };
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
          <Button className={this.state.dataset===diamonds && 'selected'} onClick={() => this.setState({ dataset: diamonds })} bsSize="small">diamonds</Button>
          <Button className={this.state.dataset===diamondsSmall && 'selected'} onClick={() => this.setState({ dataset: diamondsSmall })} bsSize="small">diamonds-small</Button>
          <Button className={this.state.dataset===iris && 'selected'} onClick={() => this.setState({ dataset: iris })} bsSize="small">iris</Button>
          <Button className={this.state.dataset===meat && 'selected'} onClick={() => this.setState({ dataset: meat })} bsSize="small">meat</Button>
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
