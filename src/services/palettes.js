import colorbrewer from 'colorbrewer';
import { scaleLinear } from 'd3';
import  { interpolateSpectral } from 'd3-scale-chromatic';

exports.categorical = (n) => {
  if (n===1) {
    return () => 'steelblue';
  }
  return (i) => colorbrewer.Set3[n][i % n];
}

exports.numerical = (low, high) => {
  return (x) => {
    var xScaled = scaleLinear()
      .domain([low, high])
      .range([0, 1])
      (x);
    return interpolateSpectral(xScaled);
  }
}
