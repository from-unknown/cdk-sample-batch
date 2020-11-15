import * as webpack from 'webpack';

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            node: '12.18.1',
          },
          modules: 'commonjs',
        },
      ],
    ],
  },
};

const config: webpack.Configuration = {
  cache: true,
  stats: {
    errorDetails: true,
  },
  entry: ['@babel/polyfill', __dirname + '/main.ts'], //ビルドするファイル
  output: {
    path: __dirname + '/dist', //ビルドしたファイルを吐き出す場所
    filename: 'bundled.js', //ビルドした後のファイル名
    library: 'bundled',
    libraryTarget: 'commonjs2',
  },
  mode: 'production',
  target: 'node',
  resolve: {
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [babelLoader, { loader: 'ts-loader' }],
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        use: [babelLoader],
        exclude: /node_modules/,
      },
    ],
  },
};

export default config;
