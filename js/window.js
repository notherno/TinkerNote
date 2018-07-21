require('webix/webix.css')
require('webix')
const firebase = require('firebase/app')
require('firebase/database')
const config = require('../config')

const app = firebase.initializeApp(config)
const firebaseDb = app.database().ref()

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
  $$(textareaId).attachEvent('onTimedKeyPress', (code, e) => {
    firebaseDb
      .child(id)
      .child('text')
      .set($$(textareaId).getValue())
    firebaseDb
      .child(id)
      .child('from')
      .set('window')
    //console.log(id);
    //console.log($$(textareaId).getValue());
  })
  return w
}

firebaseDb.on('child_added', childSnapshot => {
  console.log(childSnapshot)
  newWindow(childSnapshot.key, childSnapshot.val().text).show()
})

firebaseDb.on('child_changed', childSnapshot => {
  //firebaseRootRef.child(childSnapshot.key()).child('text').set(childSnapshot.val());
  var textareaId = 'textarea-' + childSnapshot.key
  $$(textareaId).setValue(childSnapshot.val().text)
  //console.log('child_changed', childSnapshot.val());
})
