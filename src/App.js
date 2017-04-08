import React, { Component } from 'react';
import { Label, Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import FontAwesome from 'react-fontawesome';

import _ from 'lodash';
import { histogram } from 'd3';
import simpleStatistics from 'simple-statistics';
import 'font-awesome/css/font-awesome.css';
import 'bootswatch/lumen/bootstrap.css';
import './index.css';

import charts from './services/charts';

import Summary from './components/Summary/Summary';
import PossibleCharts from './components/PossibleCharts/PossibleCharts';
import DraggableField from './components/DraggableField/DraggableField';
import FieldTarget from './components/FieldTarget/FieldTarget';
import Box from './components/Box/Box';

const diamonds = require('../datasets/diamonds.json');
// const diamonds = require('../datasets/diamonds-small.json');


function collectionToDataFrame(data) {
  var df = {};
  _.keys(data[0]).map((key) => {
    df[key] = _.map(data, key)
  });
  return df;
}

function calculateSummary(x) {
  if (isNaN(x[0])) {
    var agg = _.countBy(x);
    return _.sortBy(_.toPairs(agg), (i) => -i[1]);
  }
  return {
    min: simpleStatistics.min(x),
    q25: simpleStatistics.quantile(x, 0.25),
    median: simpleStatistics.median(x),
    mean: simpleStatistics.mean(x),
    q75: simpleStatistics.quantile(x, 0.25),
    max: simpleStatistics.max(x)
  }
}

var df = collectionToDataFrame(diamonds);
var summary = {}
_.keys(df).map((key) => {
  summary[key] = calculateSummary(df[key]);
});

const theme = {
  primaryColor: '#555555', // '#158CBA'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: null,
      x: { name: null, type: null },
      y: { name: null, type: null },
      color: { name: null, type: null },
    }
  }

  getDiamondsData(x, y) {
    return _.map(diamonds, (row) => {
      var data = {
        x: row[x]
      }
      if (y) {
        data.y = row[y];
      }
      return data;
    });
  }

  getScatterData(x, y) {
    var data = this.getDiamondsData(x, y);
    data = _.sampleSize(data, Math.min(data.length, 1000));
    return {
      labels: `${x} vs. ${y}`,
      datasets: [{
        backgroundColor: theme.primaryColor,
        borderColor: theme.primaryColor,
        borderWidth: 1,
        hoverBackgroundColor: 'coral',
        hoverBorderColor: 'coral',
        data: data
      }]
    }
  }

  getLineData(x, y) {
    var data = this.getDiamondsData(x, y);
    data = _.sampleSize(data, Math.min(data.length, 20));
    if (! y) {
      data = _.zip(_.range(0, data.length), data).map((item) => {
        return { x: item[0], y: item[1].x }
      });
    }
    return {
      labels: _.range(0, data.length).map((i) => `${i}`),
      datasets: [{
        fill: false,
        borderColor: theme.primaryColor,
        borderWidth: 1,
        lineTension: 0,
        pointRadius: 2,
        data: data
      }]
    }
  }

  getHistogramData(x) {
    var data = _.map(diamonds, (item) => item[x]);

    var values, labels;
    if (isNaN(data[0])) {
      var agg = _.countBy(data);
      labels = _.keys(agg);
      values = _.values(agg);
    } else {
      var hist = histogram().thresholds(19)
      var bins = hist(data);
      labels = _.map(bins, (x) => x.x0);
      values = _.map(bins, (x) => x.length);
    }

    return {
      labels: labels,
      datasets: [{
        label: x,
        backgroundColor: theme.primaryColor,
        borderColor: theme.primaryColor,
        borderWidth: 1,
        data: values,
      }]
    };
  }

  getSummaryStats() {
    return _.toPairs(summary);
  }

  getColumns() {
    return _.keys(diamonds[0]).map((key) => {
      return { name: key, type: isNaN(diamonds[0][key]) ? 'categorical' : 'number' }
    });
  }

  addDimension(dimension, column) {
    var { state } = this;
    state[dimension] = column;
    this.setState(state);
    this.setState({ chartType: null });
  }

  getChartType() {
    this.state.x.name
    this.state.y.name
  }

  render() {

    var chart, guessedChartType;
    if (!this.state.x.name && !this.state.y.name) {
      chart = <Summary statistics={this.getSummaryStats()} />
    } else if (this.state.chartType) {
      if (this.state.chartType==='line') {
        chart = charts.makeLine(this.getLineData(this.state.x.name, this.state.y.name), this.state.x.name);
      } else if (this.state.chartType==='histogram') {
        chart = charts.makeHistogram(this.getHistogramData(this.state.x.name), this.state.x.name);
      } else if (this.state.chartType==='bar') {
        chart = charts.makeHistogram(this.getHistogramData(this.state.x.name), this.state.x.name);
      } else if (this.state.chartType==='scatter') {
        chart = charts.makeScatter(this.getScatterData(this.state.x.name, this.state.y.name), this.state.x.name, this.state.y.name);
      }
    } else if (this.state.x.name && this.state.y.name && diamonds.length < 100) {
      chart = charts.makeLine(this.getLineData(this.state.x.name, this.state.y.name), this.state.x.name);
      guessedChartType = 'line';
    } else if (this.state.x.name && this.state.y.name) {
      chart = charts.makeScatter(this.getScatterData(this.state.x.name, this.state.y.name), this.state.x.name, this.state.y.name);
      guessedChartType = 'scatter';
    } else if (this.state.x.name) {
      chart = charts.makeHistogram(this.getHistogramData(this.state.x.name), this.state.x.name);
      guessedChartType = 'histogram';
    }

    return (
      <DragDropContextProvider backend={HTML5Backend}>
        <div>
          <br />
          <Grid>
            <Row>
              <Col sm={2}>
                  <div>
                    {this.getColumns().map((column) => {
                      return (
                        <div style={{ marginBottom: 10 }}>
                          <DraggableField name={column.name}
                                          icon={<FontAwesome name={column.type==='number' ? 'hashtag' : 'font'} />}
                                          onClick={() => this.addDimension(! this.state.x.name ? 'x' : 'y', column)}
                                          onDrop={(dimension) => this.addDimension(dimension, column)} />
                        </div>
                      );
                    })}
                    <Button style={{ position: 'fixed', bottom: 0, right: 33 }}
                            onClick={() => alert('This does nothing!')}
                            bsStyle="primary"
                            bsSize="small"><FontAwesome name='save' /></Button>

                    <Button style={{ position: 'fixed', bottom: 0, right: 0 }}
                            onClick={() => this.setState({ x: {}, y: {}, color: {} })}
                            bsStyle="danger"
                            bsSize="small"><FontAwesome name='trash' /></Button>
                  </div>
              </Col>
              <Col sm={10}>
                <Row>
                  <Col sm={12}>
                    <Row>
                      <Col sm={3}>
                        <FieldTarget dimension='x'>
                          <Box style={{ minHeight: 40 }}>
                            <DraggableField dimension='x'
                                            name={this.state.x.name}
                                            removeDimension={() => this.setState({ x: { name: null, type: null } })} />
                          </Box>
                        </FieldTarget>
                      </Col>
                      <Col sm={3}>
                        <FieldTarget dimension='y'>
                          <Box style={{ minHeight: 40 }}>
                            <DraggableField dimension='y'
                                            name={this.state.y.name}
                                            removeDimension={() => this.setState({ y: { name: null, type: null } })} />
                          </Box>
                        </FieldTarget>
                      </Col>
                      <Col sm={3}>
                        <FieldTarget dimension='color'>
                          <Box style={{ minHeight: 40 }}>
                            <DraggableField dimension='color'
                                            name={this.state.color.name}
                                            removeDimension={() => this.setState({ color: { name: null, type: null } })} />
                          </Box>
                        </FieldTarget>
                      </Col>
                      <Col smOffset={2} sm={1}>
                        <PossibleCharts
                          x={this.state.x}
                          y={this.state.y}
                          selectedChartType={this.state.chartType || guessedChartType}
                          onClick={(chartType) => this.setState({ chartType: chartType })}
                          />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <hr />
                <div style={{ minHeight: 350*2 - 75 - 17 }}>
                  {chart}
                </div>
              </Col>
            </Row>
          </Grid>
        </div>
      </DragDropContextProvider>
    );
  }
}

export default App;
