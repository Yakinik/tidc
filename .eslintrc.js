module.exports = {
  extends: 'eslint:recommended',
  env: {
    es2017: true,
    browser: true,
    jquery: true
  },
  plugins: ['prettier'],
  rules: {
    'no-useless-escape': 'off', // 正規表現で不要なバックスラッシュを検出しない
    'no-extra-boolean-cast': 'off', // 頭に !! でBool化するものを検出しない: !!getData() 等
    'no-irregular-whitespace': [
      // 不規則なスペースを検出する
      'error',
      {
        skipComments: true, // コメント内はスキップする
        skipRegExps: true // 正規表現内はスキップする
      }
    ],
    'no-unused-vars': [
      // 利用していない変数を検出する
      'error',
      {
        vars: 'local', // ローカル変数のみ検出する
        args: 'none' // 引数を検出しない
      }
    ],
    'no-dupe-keys': 'off', // 頭に !! でBool化するものを検出しない: !!getData() 等
    // "no-unused-vars": "off", // 未使用変数を検出しない
    'prettier/prettier': 'error'
  }
};
