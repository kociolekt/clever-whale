let base = require('./webpack.config.base');

module.exports = Object.assign({}, {
    mode: 'development',
    devtool: 'source-map'
}, base);
