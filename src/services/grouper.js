var _ = require('lodash');

// monkey-patch functions
_.median = (x) => {
  x = x.sort();
  var idx = Math.round(x.length / 2);
  return x[idx];
}


exports.calculate = (data, groupers) => {
  var aggregateFunctions = {
    count: (x) => x.length,
    min: (x) => _.min(_.map(x, 'price')),
    max: (x) => _.max(_.map(x, 'price')),
    mean: (x) => _.mean(_.map(x, 'price')),
    median: (x) => _.median(_.map(x, 'price')),
    sum: (x) => _.sum(_.map(x, 'price')),
  }

  var agg = _.groupBy(data, (row) => _.values(_.pick(row, groupers)).join('-'));
  var result = _.mapValues(agg, (value, key) => {
    return _.mapValues(aggregateFunctions, (func, key) => func(value))
  });

  return result;
}

exports.aggregate = (data, groupers) => {
  return _.groupBy(data, (row) => _.values(_.pick(row, groupers)).join('-'));  
}
