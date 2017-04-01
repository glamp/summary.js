import React, { Component } from 'react';
import { Label, Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import 'bootswatch/simplex/bootstrap.css';
import FontAwesome from 'react-fontawesome';
import './index.css';
import 'font-awesome/css/font-awesome.css';
import { Bar, Line } from 'react-chartjs-2';
import _ from 'lodash';
import * as d3 from 'd3';
import simpleStatistics from 'simple-statistics';

const diamonds = require('../datasets/diamonds.json');

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

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
  primaryColor: '#158CBA'
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { chartType: 'bar' }
  }

  getDiamondsData(x, y) {
    return _.map(diamonds, (row) => {
      return {
        x: row[x],
        y: row[y]
      };
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

  getLineData(x) {
    var data = _.map(diamonds, x);
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
      var hist = d3.histogram().thresholds(19)
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

  addDimension(columnName) {
    if (! this.state.x || this.state.chartType==='bar') {
      this.setState({ x: columnName })
      return;
    }
    this.setState({ y: columnName })
  }

  render() {

    var chart;


    if (!this.state.x && !this.state.y) {
      chart = (
        <Grid style={{ width: '100%', height: 350*2 - 75 - 50 }}>
          <Row className='text-center'>
            {this.getSummaryStats().map((stat) => {
              if (_.isArray(stat[1])===true) {
                return (
                  <Col className='box text-center' sm={3}>
                    <b className="muted">{stat[0]}</b>
                    <hr style={{ margin: 0, padding: 0}}/>
                    {_.range(0, 6).map((i) => {
                      var item = stat[1][i];
                      if (! item) {
                        return <p className="stat">{'-'}</p>
                      }
                      return (
                        <p className="stat">{item[0]}: {item[1]}</p>
                      );
                    })}
                  </Col>
                )
              }

              return (
                  <Col className='box text-center' sm={3}>
                    <b className="muted">{stat[0]}</b>
                    <hr style={{ margin: 0, padding: 0}}/>
                    <p className="stat">Min: {round(stat[1].min, 3)}</p>
                    <p className="stat">25%: {round(stat[1].q25, 3)}</p>
                    <p className="stat">Mean: {round(stat[1].mean, 3)}</p>
                    <p className="stat">Median: {round(stat[1].median, 3)}</p>
                    <p className="stat">75%: {round(stat[1].q75, 3)}</p>
                    <p className="stat">Max: {round(stat[1].max, 3)}</p>
                  </Col>
              );
            })}
          </Row>
        </Grid>
      );
    } else if (diamonds.length > 50 && (this.state.chartType==='bar' || !this.state.y)) {
      chart = <Bar
          data={this.getHistogramData(this.state.x)}
          width={100}
          height={350*2 - 75 - 50}
          options={{
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                scaleLabel: {
                  display: true,
                  fontSize: 16,
                  fontStyle: 'italic',
                  labelString: this.state.x
                }
              }],
            },
            maintainAspectRatio: false
          }}
        />
    } else if (diamonds.length <= 50 && (this.state.chartType==='bar' || !this.state.y)) {
      chart = <Line
          data={this.getLineData(this.state.x)}
          width={100}
          height={350*2 - 75 - 50}
          options={{
            legend: {
              display: false
            },
            showLines: true,
            scales: {
              xAxes: [{
                scaleLabel: {
                  display: true,
                  fontSize: 16,
                  fontStyle: 'italic',
                  labelString: this.state.x
                }
              }]
            },
            maintainAspectRatio: false
          }}
        />
    } else if (this.state.chartType==='scatter') {
      chart = <Line
          data={this.getScatterData(this.state.x, this.state.y)}
          width={100}
          height={350*2 - 75 - 50}
          options={{
            legend: {
              display: false
            },
            showLines: false,
            scales: {
              xAxes: [{
                scaleLabel: {
                  display: true,
                  fontSize: 16,
                  fontStyle: 'italic',
                  labelString: this.state.x
                },
                type: 'linear',
                position: 'bottom'
              }],
              yAxes: [{
                scaleLabel: {
                  display: true,
                  fontSize: 16,
                  fontStyle: 'italic',
                  labelString: this.state.y
                },
              }]
            },
            maintainAspectRatio: false
          }}
        />
    }

    return (
      <div>
        <br />
        <Grid>
          <Row>
            <Col sm={3}>
              <Panel style={{ minHeight: 700, maxHeight: 700, overflow: 'scroll' }}>
                <div>
                  {this.getColumns().map((column) => {
                    return (
                      <p onClick={() => this.addDimension(column.name)} className="highlight">
                        <FontAwesome name={column.type==='number' ? 'hashtag' : 'bars'} />{' '}{column.name}
                      </p>
                    );
                  })}
                </div>
              </Panel>
            </Col>
            <Col sm={9}>
              <Row>
                <Col sm={8}>
                  <Panel style={{ minHeight: 75, padding: 5 }}>
                    <div>
                      <Label bsStyle="primary">{this.state.x}</Label>{' '}
                    </div>
                    <hr style={{ margin: 5 }}/>
                    <div>
                      <Label bsStyle="primary">{this.state.y}</Label>{' '}
                    </div>
                  </Panel>
                </Col>
                <Col sm={2} onClick={() => this.setState({ x: null, y: null, chartType: this.state.chartType==='scatter' ? 'bar' : 'scatter' })}>
                  <Panel className='text-center'>
                    <div className={this.state.chartType==='scatter' ? '' : 'hide'}>
                      <FontAwesome name='area-chart' size='2x' />
                      <p>Line Chart</p>
                    </div>
                    <div className={this.state.chartType==='bar' ? '' : 'hide'}>
                      <FontAwesome name='bar-chart' size='2x' />
                      <p>Bar Chart</p>
                    </div>
                  </Panel>
                </Col>
                <Col sm={2} onClick={() => this.setState({ x: null, y: null })}>
                  <Panel className='text-center'>
                    <FontAwesome name='trash' size='2x' />
                    <p>Clear</p>
                  </Panel>
                </Col>
              </Row>
              <Panel style={{ minHeight: 350*2 - 75 - 17 }}>
                {chart}
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
