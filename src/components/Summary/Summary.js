import React, { Component, PropTypes } from 'react';
import { Label, Grid, Row, Col  } from 'react-bootstrap';
import './summary.css';
import _ from 'lodash';
import Box from '../Box/Box';

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}


class Stat extends Component {
  render() {
    return (
      <Row>
        <Col sm={6} className="stat text-right">{this.props.name}</Col>
        <Col sm={6} className="stat text-left">{this.props.value}</Col>
      </Row>
    )
  }
}

export default class Summary extends Component {
  render() {
    return (
      <Grid style={{ width: '100%', height: 350*2 - 75 - 50 }}>
        <Row className='text-center'>
          {this.props.statistics.map((stat) => {
            if (_.isArray(stat[1])===true) {
              return (
                <Col key={`statistic-${stat[0]}`} className='text-center' sm={3}>
                  <Box>
                    <b className="muted">{stat[0]}</b>
                    <hr style={{ margin: 0, padding: 0}}/>
                    {_.range(0, 6).map((i) => {
                      var item = stat[1][i];
                      if (! item) {
                        return <p className="stat">{'-'}</p>
                      }
                      return <Stat name={item[0]} value={item[1]} />
                    })}
                  </Box>
                </Col>
              )
            }

            return (
                <Col key={`statistic-${stat[0]}`} className="text-center" sm={3}>
                  <Box>
                    <b className="muted">{stat[0]}</b>
                    <hr style={{ margin: 0, padding: 0}}/>
                    <Stat name={"Min"} value={round(stat[1].min, 3)} />
                    <Stat name={"25%"} value={round(stat[1].q25, 3)} />
                    <Stat name={"Mean"} value={round(stat[1].mean, 3)} />
                    <Stat name={"Median"} value={round(stat[1].median, 3)} />
                    <Stat name={"75%"} value={round(stat[1].q75, 3)} />
                    <Stat name={"Max"} value={round(stat[1].max, 3)} />
                  </Box>
                </Col>
            );
          })}
        </Row>
      </Grid>
    );
  }
}
