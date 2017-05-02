import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import _ from 'lodash';


function isDate(data, axis) {
  return data.datasets[0].data[0][axis] instanceof Date;
}

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
            },
            type: isDate(data, 'x') ? 'time' : 'linear',
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
            type: isDate(data, 'x') ? 'time' : 'linear',
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
