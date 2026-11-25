# Mizu-JSON-Manager
JSONファイルをデータの保存先として使いやすくするためのパッケージ

Shizukuが試しに作ったものです。
JSONを軽いデータベースとしてよく使うのでそのためのパッケージです。

|req|ver|
|---|---|
|Node.js| > v17.0.0|

### インストール
```
npm install @suitoshizuku/mizu-json-manager
```

### 使い方
```ts
import MJM from "./src/index"

const DB1 = new MJM('filename.json', {initial_value: {text:"abc"}})
console.log(DB1.data) // → abc

DB1.data.text = "def"
console.log(DB1.isSynced()) // → false
console.log(DB1.isSynced({text: "abc"})) // → true

DB1.save() // JSONファイルに反映

console.log(DB1.isSynced()) // → true
```

#### プロパティ・メソッドについて
|プロパティ・メソッド|説明|
|:---|:---|
|`.data`|JSONをオブジェクトに変換したもの|
|`.file`|ファイル名・ファイルパス・エンコード形式の情報|
|`.init(bool?)`|初期値に戻す。引数を`true`にするとファイルにも反映する|
|`.reload()`|ファイルから再度読み込む|
|`.save()`|ファイルに書き込む|
|`.isSynced(obj?)`|ファイル(もしくは`obj`)と`.data`が等しいかを返す。|

忘れそうだからメモ
`isSynced()`が`JSON.Stringify()`で比較してるから、中身が同じでもキーの順番が違うと`false`を返す