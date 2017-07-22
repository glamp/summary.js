import React from 'react';
import { Bar, HorizontalBar, Line } from 'react-chartjs-2';
import _ from 'lodash';
import { histogram } from 'd3';

exports.makeHistogram = (data, xlab) => {
  return (
    <Bar
      data={data}
      width={100}
      height={350*2 - 75 - 50}
      options={{
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontStyle: 'italic',
              labelString: xlab
            }
          }],
        },
        maintainAspectRatio: false
      }}
    />
  );
}

exports.makeHorizontalBar = (data, xlab) => {
  return (
    <HorizontalBar
      data={data}
      width={100}
      height={350*2 - 75 - 50}
      options={{
        legend: {
          display: true
        },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontStyle: 'italic',
              labelString: xlab
            }
          }],
        },
        maintainAspectRatio: false
      }}
    />
  );
}

exports.makeLine = (data, xlab) => {
  return (
    <Line
      data={data}
      width={100}
      height={350*2 - 75 - 50}
      options={{
        legend: {
          display: true
        },
        showLines: true,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontStyle: 'italic',
              labelString: xlab
            }
          }]
        },
        maintainAspectRatio: false
      }}
    />
  );
}

exports.makeScatter = (data, xlab, ylab) => {
  return (
    <Line
      data={data}
      width={100}
      height={350*2 - 75 - 50}
      options={{
        legend: {
          display: true
        },
        showLines: false,
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontStyle: 'italic',
              labelString: xlab
            },
            type: 'linear',
            position: 'bottom'
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              fontSize: 16,
              fontStyle: 'italic',
              labelString: ylab
            },
          }]
        },
        maintainAspectRatio: false
      }}
    />
  );
}
