const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
    entry: './src/index.js',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: [{
                    loader: 'babel-loader',
                },
            ],
        }, ],
    },
    plugins: [
        new ESLintPlugin(),
    ],
};
