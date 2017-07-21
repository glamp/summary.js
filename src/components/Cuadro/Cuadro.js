import React, { Component } from 'react';
import { Label, Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import _ from 'lodash';
import { histogram } from 'd3';
import simpleStatistics from 'simple-statistics';
import 'font-awesome/css/font-awesome.css';
import './index.css';

import charts from '../../services/charts';
import grouper from '../../services/grouper';
import palettes from '../../services/palettes';

import Summary from '../Summary/Summary';
import PossibleCharts from '../PossibleCharts/PossibleCharts';
import DraggableField from '../DraggableField/DraggableField';
import FieldTarget from '../FieldTarget/FieldTarget';
import Box from '../Box/Box';

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


const theme = {
  primaryColor: 'rgb(85, 85, 85, 1)', // '#158CBA'
}

export default class Cuadro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartType: null,
      summary: {},
      x: { name: null, type: null },
      y: { name: null, type: null },
      color: { name: null, type: null },
    }
  }

  componentDidMount() {
    this.refreshSummary(this.props.dataset);
  }

  componentWillReceiveProps(props) {
    // reset the state
    this.setState({
      chartType: null,
      summary: {},
      x: { name: null, type: null },
      y: { name: null, type: null },
      color: { name: null, type: null },
    });
    this.refreshSummary(props.dataset);
  }

  refreshSummary(dataset) {
    var newSummary = {};
    var df = collectionToDataFrame(dataset);
    _.keys(df).map((key) => {
      newSummary[key] = calculateSummary(df[key]);
    });
    this.setState({ summary: newSummary });
  }

  getScatterData(x, y) {
    var data = _.cloneDeep(_.sampleSize(this.props.dataset, Math.min(this.props.dataset.length, 1000)));
    var groupers = [];
    if (this.state.color.name) {
      groupers.push(this.state.color.name);
    }

    if (this.state.x.type!=='number') {
      var xValues = _.uniq(_.map(data, this.state.x.name));
      data = _.map(data, (row) => {
        row[this.state.x.name] = xValues.indexOf(row[this.state.x.name]);
        return row;
      });
    }

    if (this.state.y.type!=='number') {
      var yValues = _.uniq(_.map(data, this.state.y.name));
      data = _.map(data, (row) => {
        row[this.state.y.name] = yValues.indexOf(row[this.state.y.name]);
        return row;
      });
    }

    var aggregatedData = grouper.aggregate(data, groupers);

    var colorGen;
    var c = 0;
    if (! this.state.color.name) {
      colorGen = palettes.categorical(1);
    } else if (this.state.color.type==='number') {
      var colorData = _.map(data, this.state.color.name);
      var min = _.min(colorData);
      var max = _.max(colorData);
      colorGen = palettes.numerical(min, max);
    } else {
      var nColorsNeeded = _.size(aggregatedData);
      colorGen = palettes.categorical(nColorsNeeded);
    }

    var datasets = _.map(_.toPairs(aggregatedData), (group) => {
      c++;
      var bgColor, borderColor;
      if (this.state.color.type==='number') {
        borderColor = _.map(group[1], (i) => colorGen(i[this.state.color.name]));
        bgColor = _.map(borderColor, (i) => i.replace(', 1)', ', 0.5)'));
      } else {
        borderColor = colorGen(c);
        bgColor = borderColor.replace(', 1)', ', 0.5)');
      }

      return {
        label: group[0],
        backgroundColor: bgColor,
        borderColor: borderColor,
        borderWidth: 1,
        data:  _.map(group[1], (i) => {
          return { x: i[x], y: i[y] };
        }),
      }
    });
    return {
      datasets: datasets
    }
  }

  getLineData(x, y) {
    var data = [];
    if (x && y) {
      data = _.map(this.props.dataset, (i) => {
        return { x: i[x], y: i[y] };
      });
    } else if (x) {
      data = _.map(this.props.dataset, x);
    } else {
      return {};
    }
    data = _.cloneDeep(_.sampleSize(data, Math.min(data.length, 20)));
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
    var data = _.cloneDeep(_.map(this.props.dataset, x));

    var min = _.min(data);
    var max = _.max(data);
    var hist = histogram().domain([min, max]);
    var aggregatedData = grouper.aggregate(this.props.dataset, [this.state.color.name]);

    var c = 0;
    var nColorsNeeded = _.size(aggregatedData);
    var colorGen;
    var labelRange;
    if (nColorsNeeded > 30) {
      colorGen = palettes.numerical(_.min(_.map(this.props.dataset, this.state.color.name)), _.max(_.map(this.props.dataset, this.state.color.name)));
      labelRange = _.range(0, nColorsNeeded, Math.floor(nColorsNeeded / 10));
    } else {
      colorGen = palettes.categorical(nColorsNeeded);
    }

    var datasets = _.map(_.toPairs(aggregatedData), (group) => {
      var labels;
      var values;
      if (this.state.x.type==='number') {
        var bins = hist(_.map(group[1], x));
        labels = _.map(bins, 'x0');
        values = _.map(bins, (x) => x.length);
      } else {
        var counts = _.countBy(_.map(group[1], x));
        labels = _.keys(counts);
        values = _.values(counts);
      }

      var color = colorGen(c);
      c++;
      var dataset = {
        backgroundColor: color.replace(', 1)', ', 0.5)'),
        borderColor: color,
        borderWidth: 2,
        data: values,
      }

      if (labelRange) {
        if (_.indexOf(labelRange, group[0]) > -1) {
          dataset.label = group[0];
        }
      } else {
        dataset.label = group[0] || 'count';
      }
      return dataset;
    });

    var labels;
    if (this.state.x.type==='number') {
      labels = _.map(hist(data), 'x0')
    } else {
      var counts = _.countBy(data);
      labels = _.keys(counts);
    }

    return {
      labels: labels,
      datasets: datasets
    };
  }

  getSummaryStats() {
    return _.toPairs(this.state.summary);
  }

  getColumns() {
    return _.keys(this.props.dataset[0]).map((key) => {
      return { name: key, type: isNaN(this.props.dataset[0][key]) ? 'categorical' : 'number' }
    });
  }

  addDimension(dimension, column) {
    var { state } = this;
    if (dimension===null) {
      if (state.x.name===null) {
        dimension = 'x';
      } else if (state.y.name===null) {
        dimension = 'y';
      } else if (state.color.name===null) {
        dimension = 'color';
      }
    }
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
    } else if (this.state.x.name && this.state.y.name && this.props.dataset.length < 100) {
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

        <div>
          <br />
          <Grid>
            <Row>
              <Col sm={2}>
                  <div>
                    <Box alignment="text-left" style={{ height: 350, overflow: 'scroll' }}>
                      <p><b>Dimensions</b></p>
                      {this.getColumns().filter((i) => i.type!=='number').map((column) => {
                        return (
                          <div key={`dimension-${column.name}`} style={{ marginBottom: 10 }}>
                            <DraggableField name={column.name}
                                            icon={<FontAwesome name={column.type==='number' ? 'hashtag' : 'font'} style={{ color: palettes.categorical(1)(0) }} />}
                                            onClick={() => this.addDimension(null, column)}
                                            onDrop={(dimension) => this.addDimension(dimension, column)} />
                          </div>
                        );
                      })}
                      </Box>
                      <Box alignment="text-left" style={{ height: 350, overflow: 'scroll' }}>
                        <p><b>Measures</b></p>
                      {this.getColumns().filter((i) => i.type==='number').map((column) => {
                        return (
                          <div key={`measure-${column.name}`}style={{ marginBottom: 10 }}>
                            <DraggableField name={column.name}
                                            icon={<FontAwesome name={column.type==='number' ? 'hashtag' : 'font'} style={{ color: palettes.categorical(1)(0) }} />}
                                            onClick={() => this.addDimension(null, column)}
                                            onDrop={(dimension) => this.addDimension(dimension, column)} />
                          </div>
                        );
                      })}
                      </Box>
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
                    <Row className="text-center">
                      <Col sm={3}>
                        <FieldTarget dimension='x'>
                          <DraggableField dimension='x'
                                          name={this.state.x.name}
                                          removeDimension={() => this.setState({ x: { name: null, type: null } })} />
                        </FieldTarget>
                      </Col>
                      <Col sm={3}>
                        <FieldTarget dimension='y'>
                          <DraggableField dimension='y'
                                          name={this.state.y.name}
                                          removeDimension={() => this.setState({ y: { name: null, type: null } })} />
                        </FieldTarget>
                      </Col>
                      <Col sm={3}>
                        <FieldTarget dimension='color'>
                          <DraggableField dimension='color'
                                          name={this.state.color.name}
                                          removeDimension={() => this.setState({ color: { name: null, type: null } })} />
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
    );
  }
}
