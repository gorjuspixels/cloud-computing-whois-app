module.exports = {
    entry: './react-app/index',
    output: {
        path: './react-app/dist',
        filename: 'index.js'
    },
    module: {
        loaders: [
            {
                test: /\.js/,
                exclude: /node_modules/,
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015']
                }
            }
        ]
    }
};
