var firebaseRootRef = new Firebase("https://xxxxxxx.firebaseio.com/");

function newWindow(id, text) {
  var textareaId = "textarea-" + id;
  var window = webix.ui({
    view: "window",
    id: id,
    head: id,
    move: true,
    width: 300,
    height: 200,
    body:{
      view: "textarea",
      id: textareaId,
      value: text
    }
  });
  $$(textareaId).attachEvent("onTimedKeyPress", function(code, e) {
    firebaseRootRef.child(id).child('text').set($$(textareaId).getValue());
    firebaseRootRef.child(id).child('from').set('window');
    //console.log(id);
    //console.log($$(textareaId).getValue());
  });
  return window;
}

firebaseRootRef.on('child_added', function(childSnapshot) {
  newWindow(childSnapshot.key(), childSnapshot.val().text).show();
  //console.log('child_added', childSnapshot.val());
});

firebaseRootRef.on('child_changed', function(childSnapshot) {
  //firebaseRootRef.child(childSnapshot.key()).child('text').set(childSnapshot.val());
  var textareaId = 'textarea-' + childSnapshot.key(); 
  $$(textareaId).setValue(childSnapshot.val().text);
  //console.log('child_changed', childSnapshot.val());
});
