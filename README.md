# TinkerNote

- 紙のノートのようにレイアウトがつけられるメモアプリを目指したい
- バグだらけ

## 雑な gif

[![https://gyazo.com/7557b25a041b399f8326d4912062121e](https://i.gyazo.com/7557b25a041b399f8326d4912062121e.gif)](https://gyazo.com/7557b25a041b399f8326d4912062121e)

[![https://gyazo.com/2b9fe8ddd0067587de719cb0a64de757](https://i.gyazo.com/2b9fe8ddd0067587de719cb0a64de757.gif)](https://gyazo.com/2b9fe8ddd0067587de719cb0a64de757)

# Configuration

Install npm dependencies

```
$ npm install
```

[Create your firebase project](https://console.firebase.google.com/) and fill out the conguration file

```
$ cp config.sample.js config.ts
$ cat config.ts
export default {
  apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  databaseURL: 'https://xxxxxxxxxxxxxxx.firebaseio.com',
}
```

Start development server

```
$ npm start
```
