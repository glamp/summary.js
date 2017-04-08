var d3 = require('d3');
var d3 = Object.assign({}, require("d3-scale"), require("d3-scale-chromatic"))

var scale = d3.scaleLinear()
                    .domain([0, 10000])
                    .range([0, 1]);

console.log(d3.interpolateBlues(scale(100)));
