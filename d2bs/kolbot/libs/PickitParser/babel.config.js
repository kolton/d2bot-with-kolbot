const config = {
  comments: false,
  plugins: [
    '@babel/proposal-object-rest-spread',
    '@babel/plugin-transform-computed-properties',
    '@babel/plugin-transform-destructuring',
    '@babel/plugin-transform-shorthand-properties',
    '@babel/plugin-transform-template-literals',
    '@babel/plugin-proposal-optional-chaining',
  ],
  presets: ['@babel/env'],
}

module.exports = config