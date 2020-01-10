module.exports = {
  plugins: ['@babel/plugin-proposal-object-rest-spread'],
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          node: '12'
        }
      }
    ]
  ]
};
