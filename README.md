# pgbmon
[「PostgreSQLの統計情報を可視化する」](https://qiita.com/atmitani/items/815606e9be30a56af47d)で公開したソースコード一式です。
## インストール
1.　[リポジトリ](https://github.com/at-mitani/pgbmon)からダウンロードするかcloneしてソース一式を取得する。

2.　yarn コマンドでパッケージをインストールする。

```
yarn install
```
## 設定
### サーバの設定
サーバの設定はnuxt.config.jsに記述します。各自の環境に合わせて修正してください。

```nuxt.config.js
module.exports = {
  mode: 'universal',
  frontend: {
    host: '0.0.0.0', // フロントエンドのアクセスを受け付けるホスト
    port: '8080'     // フロントエンドのアクセスを受け付けるポート
  },
  backend: {
    host: '0.0.0.0',  // バックエンドのアクセスを受け付けるホスト
    port: '3000'      // バックエンドのアクセスを受け付けるポート
  },
  env: {
    apiUrl: 'http://localhost:3000',  // APIのURL
    threshold: 100,   // スロークエリ取得閾値（ミリ秒）
    limit: 20          // スロークエリ取得件数
  },
  (省略）
```

### PostgreSQLの設定
読み込むPostgreSQLの設定は"server/config.js"に記述します。各自の環境に合わせて修正してください。

```server/config.js
exports.dbConf = [
    {
        host: 'localhost',
        database: 'db1',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    },
    {
        host: 'localhost',
        database: 'db2',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    },
    {
        host: 'localhost',
        database: 'db3',
        port: 5432,
        user: 'postgres',
        password: 'postgres',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    }
]
```

## サーバ起動
yarnコマンドでビルドし、起動します。

```
yarn build
yarn start
```

## ブラウザからアクセス
デフォルト設定では、'localhost:8080'にアクセスすると初期画面が表示されます。
