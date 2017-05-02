import React, { Component, PropTypes } from 'react';
import Box from '../Box/Box';
import { Button } from 'react-bootstrap';
import ChartIcon from '../ChartIcon/ChartIcon';
import FontAwesome from 'react-fontawesome';
import './possiblecharts.css';


export default class PossibleCharts extends Component {
  static propTypes = {
    x: PropTypes.object,
    y: PropTypes.object,
    onClick: PropTypes.func,
    selectedChartType: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = { showCharts: true }
  }
  render() {
    const chartOptions = (
      <Box>
        <ChartIcon type='Line'
                   isAvailable={this.props.x.name}
                   onClick={() => this.props.onClick('line')}
                   isSelected={this.props.selectedChartType==='line'}>
        </ChartIcon>
        <hr />
        <ChartIcon type='Bar'
                   isAvailable={this.props.x.name}
                   onClick={() => this.props.onClick('bar')}
                   isSelected={this.props.selectedChartType==='bar'}>
        </ChartIcon>
        <hr />
        <ChartIcon type='Histogram'
                   isAvailable={this.props.x.name}
                   onClick={() => this.props.onClick('histogram')}
                  isSelected={this.props.selectedChartType==='histogram'}>
        </ChartIcon>
        <hr />
        <ChartIcon type='Scatter'
                   isAvailable={this.props.x.name && this.props.y.name}
                   onClick={() => this.props.onClick('scatter')}
                   isSelected={this.props.selectedChartType==='scatter'}>
        </ChartIcon>
      </Box>
    );
    return (
      <div className="dropdown">
        <Button onClick={() => this.setState({ showCharts: !this.state.showCharts })}
                bsStyle="primary" block>
                <FontAwesome name={this.state.showCharts===true ? 'chevron-down' : 'chevron-right'} />
                {' '}
                charts
        </Button>
        <div className="dropdown-content">
          {this.state.showCharts && chartOptions}
        </div>
      </div>
    );
  }
}
