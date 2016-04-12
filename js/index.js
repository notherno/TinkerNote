var layout = webix.ui({
  type:"space",
  id: "layout",
  rows: [{
    type: "space",
    padding: 0,
    responsive: "layout",
    cols: [
      { view:"textarea",
        id: "textarea",
        width: 350
      },
      { view: "iframe",
        src: "window.html",
        template: "window-panel",
        minWidth: 500
      }
    ]}
  ]
}).show();

var firebaseRootRef = new Firebase("https://xxxxxxx.firebaseio.com/");

firebaseRootRef.orderByChild("order").once('value', function(snapshot) {
  var preloadText = "";
  snapshot.forEach(function (childSnapshot) {
    preloadText += '# ' + childSnapshot.key() + '\n' + childSnapshot.val().text + '\n';
  });
  //console.log(preloadText)
  $$("textarea").setValue(preloadText)
});

firebaseRootRef.orderByChild("order").on('child_changed', function(snapshot) {
  if (snapshot.val().from == 'window') {
    var strRe1 = '# ' + snapshot.key() + '[^>]*\n# ';
    var strRe2 = '# ' + snapshot.key() + '[^>]*$';
    var allText = $$("textarea").getValue();
    console.log(allText.match(new RegExp(strRe1)));
    console.log(allText.match(new RegExp(strRe2)));
    if (allText.match(new RegExp(strRe1))) {
      var changedText = '# ' + snapshot.key() + '\n' + snapshot.val().text + '\n# ';
      var changedAllText = allText.replace(new RegExp(strRe1), changedText)
    } else if (allText.match(new RegExp(strRe2))) {
      var changedText = '# ' + snapshot.key() + '\n' + snapshot.val().text;
      var changedAllText = allText.replace(new RegExp(strRe2), changedText)
    }
    console.log(changedAllText)
  $$("textarea").setValue(changedAllText);
  }
});

$$("textarea").attachEvent("onTimedKeyPress", function(code, e) {
  var textValue = $$("textarea").getValue();
  //console.log(textValue);
  var textArray = textValue.split(/^# |\n# /);
  textArray.shift();
  //console.log(textArray);
  var isId, id, text, order;
  textArray.forEach(function(val, index, ar) {
    //isId = val.match(/^.*\d{3}\n/);
    isId = val.match(/^.*  \n/);
    if (isId) {
      id = isId[0].replace(/\n/, '');
      //text = val.replace(/^.*\d{3}\n/, '');
      text = val.replace(/^.*  \n/, '');
      order = index;
      //console.log('id:', id);
      //console.log('text:', text);
      //console.log('order:', order);
      firebaseRootRef.child(id).child('text').set(text);
      firebaseRootRef.child(id).child('order').set(order);
      firebaseRootRef.child(id).child('from').set('textarea');
    }
  })
});


