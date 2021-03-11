module.exports = {
    publicPath: '/Assignment1/',
    outputDir: 'docs',
    assetsDir: 'static',
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "Indian Football Clubs";
                return args;
            })
    }
}