const path = require('path');

module.exports = {
    entry: './js/code.js',
    entry: {
        'scene-2': './js/scene-2.js',
        'microplastic': './js/microplastic.js',
        'microplastic-v2': './js/microplastic-v2.js',
        'load-objects': './js/load-objects.js',
    },
    output: {
        path: path.resolve(__dirname, 'js', 'dist'),
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
