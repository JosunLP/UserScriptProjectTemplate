const path = require('path');
const pkg = require('./package.json');

module.exports = {
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: pkg.name + '.bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};