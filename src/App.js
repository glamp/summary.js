import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Cuadro from './components/Cuadro/Cuadro';
import getDndContext from './services/dnd-global-context';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
import 'bootswatch/lumen/bootstrap.css';

const diamonds = require('../datasets/diamonds.json');
// const diamonds = require('../datasets/diamonds-small.json');
const diamondsSmall = require('../datasets/diamonds-small.json');
const iris = require('../datasets/iris.json');
const meat = require('../datasets/meat.json');


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { dataset: null };
  }

  getChildContext() {
    return {
      dragDropManager: getDndContext(),
    };
  }

  onDrop = (files) => {
    let file = files[0];
    let reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onloadend = () => {
      try {
        this.setState({ dataset: JSON.parse(reader.result) });
      } catch(e) {
        try {
          this.setState({ dataset: Papa.parse(reader.result, { header: true, dynamicTyping: true }).data });
        } catch(e) {
          alert("Couldn't read your file!");
        }
      }
    }
  }


  render() {
    let uploader;
    if (! this.state.dataset) {
      uploader = (
        <Dropzone onDrop={this.onDrop} style={{ width: '100%', height: '100%' }}>
          <p>Try dropping some files here, or click to select files to upload.</p>
        </Dropzone>
      );
    }

    return (
      <div>
        <div>
          <Button className={this.state.dataset===diamonds && 'selected'} onClick={() => this.setState({ dataset: diamonds })} bsSize="small">diamonds</Button>
          <Button className={this.state.dataset===diamondsSmall && 'selected'} onClick={() => this.setState({ dataset: diamondsSmall })} bsSize="small">diamonds-small</Button>
          <Button className={this.state.dataset===iris && 'selected'} onClick={() => this.setState({ dataset: iris })} bsSize="small">iris</Button>
          <Button className={this.state.dataset===meat && 'selected'} onClick={() => this.setState({ dataset: meat })} bsSize="small">meat</Button>
          <Button onClick={() => this.setState({ dataset: null})} bsSize="small">reset</Button>
          {this.state.dataset && <Cuadro dataset={this.state.dataset} />}
        </div>
        {uploader}
      </div>
    );
  }
}

App.childContextTypes = {
  dragDropManager: React.PropTypes.object.isRequired,
}

export default App;
