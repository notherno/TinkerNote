import 'webix/webix.css'
import 'webix'
import firebase from 'firebase/app'
import 'firebase/database'

import config from '../config'

const app = firebase.initializeApp(config)
const firebaseDb = app.database().ref()

function getTextareaById(id: string) {
  return $$(`textarea-${id}`) as webix.ui.textarea
}

function newWindow(id, text) {
  const textareaId = 'textarea-' + id

  const w = webix.ui({
    view: 'window',
    id: id,
    head: id,
    move: true,
    width: 300,
    height: 200,
    body: {
      view: 'textarea',
      id: textareaId,
      value: text,
    },
  })
  getTextareaById(id).attachEvent('onTimedKeyPress', (code, e) => {
    firebaseDb
      .child(id)
      .child('text')
      .set(getTextareaById(id).getValue())
    firebaseDb
      .child(id)
      .child('from')
      .set('window')
  })
  return w
}

firebaseDb.on('child_added', childSnapshot => {
  newWindow(childSnapshot.key, childSnapshot.val().text).show()
})

firebaseDb.on('child_changed', childSnapshot => {
  getTextareaById(childSnapshot.key).setValue(childSnapshot.val().text)
})
