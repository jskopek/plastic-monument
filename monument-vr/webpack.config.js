const path = require('path');

module.exports = {
    entry: './js/code.js',
    entry: {
        'code-v2': './code-v2.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(c|d|t)sv$/, // load all .csv, .dsv, .tsv files with dsv-loader
                use: ['dsv-loader'] // or dsv-loader?delimiter=,
            },
            {
                test: /\.dae$/, // load all .csv, .dsv, .tsv files with dsv-loader
                use: ['file-loader'] // or dsv-loader?delimiter=,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    // Creates `style` nodes from JS strings
                    'style-loader',
                    // Translates CSS into CommonJS
                    'css-loader',
                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            sassOptions: {
                                includePaths: [
                                    path.resolve('./css')
                                ]
                            }
                        }
                    }
                ],
            }
        ]
    }
}
