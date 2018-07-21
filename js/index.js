require('webix/webix.css')
require('webix')
const firebase = require('firebase/app')
require('firebase/database')
const config = require('../config')

const app = firebase.initializeApp(config)
const firebaseRootRef = app.database().ref()

webix
  .ui({
    type: 'space',
    id: 'layout',
    rows: [
      {
        type: 'space',
        padding: 0,
        responsive: 'layout',
        cols: [
          {
            view: 'textarea',
            id: 'textarea',
            width: 350,
          },
          {
            view: 'iframe',
            src: 'window.html',
            template: 'window-panel',
            minWidth: 500,
          },
        ],
      },
    ],
  })
  .show()

firebaseRootRef.orderByChild('order').once('value', snapshot => {
  let preloadText = ''
  snapshot.forEach(childSnapshot => {
    preloadText +=
      '# ' + childSnapshot.key + '\n' + childSnapshot.val().text + '\n'
  })
  //console.log(preloadText)
  $$('textarea').setValue(preloadText)
})

firebaseRootRef.orderByChild('order').on('child_changed', snapshot => {
  if (snapshot.val().from == 'window') {
    const strRe1 = '# ' + snapshot.key + '[^>]*\n# '
    const strRe2 = '# ' + snapshot.key + '[^>]*$'
    const allText = $$('textarea').getValue()

    console.log(allText.match(new RegExp(strRe1)))
    console.log(allText.match(new RegExp(strRe2)))

    if (allText.match(new RegExp(strRe1))) {
      const changedText =
        '# ' + snapshot.key + '\n' + snapshot.val().text + '\n# '
      const changedAllText = allText.replace(new RegExp(strRe1), changedText)
    } else if (allText.match(new RegExp(strRe2))) {
      const changedText = '# ' + snapshot.key + '\n' + snapshot.val().text
      const changedAllText = allText.replace(new RegExp(strRe2), changedText)
    }
    $$('textarea').setValue(changedAllText)
  }
})

$$('textarea').attachEvent('onTimedKeyPress', (code, e) => {
  const textValue = $$('textarea').getValue()
  //console.log(textValue);
  const textArray = textValue.split(/^# |\n# /)
  textArray.shift()
  //console.log(textArray);
  var isId, id, text, order

  textArray.forEach((val, index, ar) => {
    //isId = val.match(/^.*\d{3}\n/);
    isId = val.match(/^.*  \n/)

    if (isId) {
      id = isId[0].replace(/\n/, '')
      //text = val.replace(/^.*\d{3}\n/, '');
      text = val.replace(/^.*  \n/, '')
      order = index
      //console.log('id:', id);
      //console.log('text:', text);
      //console.log('order:', order);
      firebaseRootRef
        .child(id)
        .child('text')
        .set(text)
      firebaseRootRef
        .child(id)
        .child('order')
        .set(order)
      firebaseRootRef
        .child(id)
        .child('from')
        .set('textarea')
    }
  })
})
