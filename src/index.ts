import 'webix/webix.css'
import 'webix'

import firebase from 'firebase/app'
import 'firebase/database'

import config from '../config'

const app = firebase.initializeApp(config)
const firebaseRootRef = app.database().ref()

function getTextarea() {
  return $$('textarea') as webix.ui.textarea
}

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
    preloadText += `# ${childSnapshot.key}\n${childSnapshot.val().text}\n`
  })

  getTextarea().setValue(preloadText)
})

firebaseRootRef.orderByChild('order').on('child_changed', snapshot => {
  if (snapshot.val().from === 'window') {
    const strRe1 = `# ${snapshot.key}[^>]*\n# `
    const strRe2 = `# ${snapshot.key}[^>]*$`

    const allText = getTextarea().getValue()

    let changedAllText

    if (allText.match(new RegExp(strRe1))) {
      const changedText = `# ${snapshot.key}\n${snapshot.val().text}\n# `
      changedAllText = allText.replace(new RegExp(strRe1), changedText)
    } else if (allText.match(new RegExp(strRe2))) {
      const changedText = `# ${snapshot.key}\n${snapshot.val().text}`
      changedAllText = allText.replace(new RegExp(strRe2), changedText)
    }

    getTextarea().setValue(changedAllText)
  }
})

getTextarea().attachEvent('onTimedKeyPress', (code, e) => {
  const textValue = getTextarea().getValue()

  const textArray = textValue.split(/^# |\n# /)
  textArray.shift()

  var isId, id, text, order

  textArray.forEach((val, index, ar) => {
    isId = val.match(/^.*  \n/)

    if (isId) {
      id = isId[0].replace(/\n/, '')

      text = val.replace(/^.*  \n/, '')
      order = index

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
