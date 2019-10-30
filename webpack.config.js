const path = require('path');

module.exports = {
    entry: './js/code.js',
    output: {
        path: path.resolve(__dirname, 'js', 'dist'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(c|d|t)sv$/, // load all .csv, .dsv, .tsv files with dsv-loader
                use: ['dsv-loader'] // or dsv-loader?delimiter=,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    'sass-loader',
                ],
            }
        ]
    }
};

